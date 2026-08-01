import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderFactory } from './providers/provider.factory';
import { TimeRange } from './dto/price-history-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: ProviderFactory,
  ) {}

  async resolve(input: string) {
    const provider = this.providerFactory.getProvider(input);
    const resolved = await provider.resolve(input);

    // 1. Find or create Product by title matching
    let product = await this.prisma.product.findFirst({
      where: {
        canonicalTitle: {
          contains: resolved.title.slice(0, 20),
          mode: 'insensitive',
        },
      },
    });

    if (!product) {
      product = await this.prisma.product.create({
        data: {
          canonicalTitle: resolved.title,
          category: resolved.category || 'General',
          imageUrl: resolved.imageUrl,
        },
      });
    }

    // 2. Find or create StoreListing
    let listing = await this.prisma.storeListing.findFirst({
      where: {
        productId: product.id,
        store: resolved.store,
      },
    });

    if (!listing) {
      listing = await this.prisma.storeListing.create({
        data: {
          productId: product.id,
          store: resolved.store,
          storeUrl: resolved.storeUrl,
          storeProductId: resolved.storeProductId,
        },
      });
    }

    // 3. Check latest price snapshot (<6h stale rule per PRD)
    const latestSnapshot = await this.prisma.priceSnapshot.findFirst({
      where: { storeListingId: listing.id },
      orderBy: { capturedAt: 'desc' },
    });

    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    const isStale = !latestSnapshot || Date.now() - latestSnapshot.capturedAt.getTime() > SIX_HOURS_MS;

    if (isStale) {
      await this.prisma.priceSnapshot.create({
        data: {
          storeListingId: listing.id,
          price: resolved.currentPrice,
          mrp: resolved.mrp,
          capturedAt: new Date(),
        },
      });
    }

    return {
      productId: product.id,
      title: product.canonicalTitle,
      category: product.category,
      imageUrl: product.imageUrl,
      store: resolved.store,
      currentPrice: resolved.currentPrice,
      mrp: resolved.mrp,
    };
  }

  async getProductDetail(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        storeListings: {
          include: {
            priceSnapshots: {
              orderBy: { capturedAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Collect all price snapshots across listings for stats
    const allSnapshots = await this.prisma.priceSnapshot.findMany({
      where: {
        storeListing: {
          productId: product.id,
        },
      },
    });

    const prices = allSnapshots.map((s) => Number(s.price));
    const currentPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
    const lowestEver = prices.length > 0 ? Math.min(...prices) : 0;
    const highestEver = prices.length > 0 ? Math.max(...prices) : 0;
    const averagePrice =
      prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

    return {
      id: product.id,
      canonicalTitle: product.canonicalTitle,
      category: product.category,
      imageUrl: product.imageUrl,
      stats: {
        currentPrice,
        lowestEver,
        highestEver,
        averagePrice,
      },
      stores: product.storeListings.map((listing) => {
        const latest = listing.priceSnapshots[0];
        return {
          id: listing.id,
          store: listing.store,
          storeUrl: listing.storeUrl,
          storeProductId: listing.storeProductId,
          currentPrice: latest ? Number(latest.price) : 0,
          mrp: latest?.mrp ? Number(latest.mrp) : undefined,
          capturedAt: latest?.capturedAt,
        };
      }),
    };
  }

  async getPriceHistory(productId: string, range: TimeRange = TimeRange.ALL, store?: string) {
    const now = new Date();
    let startDate: Date | undefined;

    switch (range) {
      case TimeRange.SEVEN_DAYS:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case TimeRange.ONE_MONTH:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case TimeRange.THREE_MONTHS:
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case TimeRange.SIX_MONTHS:
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case TimeRange.ALL:
      default:
        startDate = undefined;
        break;
    }

    const snapshots = await this.prisma.priceSnapshot.findMany({
      where: {
        storeListing: {
          productId,
          ...(store ? { store: { equals: store, mode: 'insensitive' } } : {}),
        },
        ...(startDate ? { capturedAt: { gte: startDate } } : {}),
      },
      include: {
        storeListing: {
          select: { store: true },
        },
      },
      orderBy: { capturedAt: 'asc' },
    });

    return snapshots.map((s) => ({
      id: s.id,
      store: s.storeListing.store,
      price: Number(s.price),
      mrp: s.mrp ? Number(s.mrp) : null,
      date: s.capturedAt.toISOString().split('T')[0],
      capturedAt: s.capturedAt,
    }));
  }

  async getStoreComparison(productId: string) {
    const listings = await this.prisma.storeListing.findMany({
      where: { productId },
      include: {
        priceSnapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
      },
    });

    return listings.map((l) => {
      const latest = l.priceSnapshots[0];
      const price = latest ? Number(latest.price) : 0;
      const mrp = latest?.mrp ? Number(latest.mrp) : price;
      const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

      return {
        storeListingId: l.id,
        store: l.store,
        storeUrl: l.storeUrl,
        price,
        mrp,
        discountPct,
        inStock: true,
        updatedAt: latest?.capturedAt || new Date(),
      };
    });
  }

  async trackProduct(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const tracked = await this.prisma.trackedProduct.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
      },
      update: {},
      include: { product: true },
    });

    return tracked;
  }

  async untrackProduct(userId: string, productId: string) {
    await this.prisma.trackedProduct.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    return { message: 'Product untracked successfully' };
  }
}
