import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DealSortOption, QueryDealsDto } from './dto/query-deals.dto';
import { CreateDealDto } from './dto/create-deal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDeals(dto: QueryDealsDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.DealWhereInput = {};

    if (dto.store) {
      where.store = { equals: dto.store.toLowerCase(), mode: 'insensitive' };
    }

    if (dto.minDiscount) {
      where.discountPct = { gte: dto.minDiscount };
    }

    if (dto.category) {
      where.category = { equals: dto.category, mode: 'insensitive' };
    }

    let orderBy: Prisma.DealOrderByWithRelationInput = { popularityScore: 'desc' };

    switch (dto.sort) {
      case DealSortOption.DISCOUNT:
        orderBy = { discountPct: 'desc' };
        break;
      case DealSortOption.PRICE_ASC:
        orderBy = { price: 'asc' };
        break;
      case DealSortOption.PRICE_DESC:
        orderBy = { price: 'desc' };
        break;
      case DealSortOption.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case DealSortOption.POPULARITY:
      default:
        orderBy = { popularityScore: 'desc' };
        break;
    }

    const [total, deals] = await Promise.all([
      this.prisma.deal.count({ where }),
      this.prisma.deal.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: deals.map((d) => ({
        id: d.id,
        title: d.title,
        imageUrl: d.imageUrl,
        store: d.store,
        storeUrl: d.storeUrl,
        price: Number(d.price),
        mrp: d.mrp ? Number(d.mrp) : null,
        discountPct: d.discountPct,
        category: d.category,
        verified: d.verified,
        popularityScore: d.popularityScore,
        createdAt: d.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getDealById(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    return {
      id: deal.id,
      title: deal.title,
      imageUrl: deal.imageUrl,
      store: deal.store,
      storeUrl: deal.storeUrl,
      price: Number(deal.price),
      mrp: deal.mrp ? Number(deal.mrp) : null,
      discountPct: deal.discountPct,
      category: deal.category,
      verified: deal.verified,
      popularityScore: deal.popularityScore,
      createdAt: deal.createdAt,
    };
  }

  async createDeal(dto: CreateDealDto) {
    const deal = await this.prisma.deal.create({
      data: {
        title: dto.title,
        store: dto.store.toLowerCase(),
        storeUrl: dto.storeUrl,
        price: dto.price,
        mrp: dto.mrp,
        discountPct: dto.discountPct,
        category: dto.category || 'General',
        imageUrl: dto.imageUrl,
        verified: dto.verified ?? true,
        popularityScore: dto.popularityScore ?? 50,
      },
    });

    return deal;
  }
}
