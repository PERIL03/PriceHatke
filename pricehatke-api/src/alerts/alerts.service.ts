import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AlertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('alerts') private readonly alertsQueue: Queue,
  ) {}

  async createAlert(userId: string, dto: CreateAlertDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    const alert = await this.prisma.alert.create({
      data: {
        userId,
        productId: dto.productId,
        targetPrice: dto.targetPrice,
        status: 'active',
      },
      include: {
        product: true,
      },
    });

    // Also auto-track product for user when alert is created
    await this.prisma.trackedProduct.upsert({
      where: {
        userId_productId: { userId, productId: dto.productId },
      },
      create: { userId, productId: dto.productId },
      update: {},
    });

    return alert;
  }

  async getUserAlerts(userId: string) {
    const alerts = await this.prisma.alert.findMany({
      where: { userId },
      include: {
        product: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return alerts.map((a) => {
      const allSnapshots = a.product.storeListings.flatMap((l) => l.priceSnapshots);
      const latestSnapshot = allSnapshots.sort(
        (x, y) => y.capturedAt.getTime() - x.capturedAt.getTime(),
      )[0];

      return {
        id: a.id,
        productId: a.productId,
        productTitle: a.product.canonicalTitle,
        productImage: a.product.imageUrl,
        targetPrice: a.targetPrice ? Number(a.targetPrice) : null,
        status: a.status,
        createdAt: a.createdAt,
        currentLowestPrice: latestSnapshot ? Number(latestSnapshot.price) : null,
      };
    });
  }

  async deleteAlert(userId: string, alertId: string) {
    const alert = await this.prisma.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    if (alert.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this alert');
    }

    await this.prisma.alert.delete({
      where: { id: alertId },
    });

    return { message: 'Alert deleted successfully' };
  }

  async evaluateAlerts() {
    const activeAlerts = await this.prisma.alert.findMany({
      where: { status: 'active' },
      include: {
        user: { select: { email: true, name: true } },
        product: {
          include: {
            storeListings: {
              include: {
                priceSnapshots: {
                  orderBy: { capturedAt: 'desc' },
                  take: 2,
                },
              },
            },
          },
        },
      },
    });

    let triggeredCount = 0;

    for (const alert of activeAlerts) {
      // Find current lowest price across store listings
      const latestSnapshots = alert.product.storeListings
        .flatMap((l) => l.priceSnapshots)
        .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime());

      const currentLowest = latestSnapshots[0];
      if (!currentLowest) continue;

      const currentPrice = Number(currentLowest.price);
      const targetPrice = alert.targetPrice ? Number(alert.targetPrice) : null;

      let isTriggered = false;
      if (targetPrice !== null && currentPrice <= targetPrice) {
        isTriggered = true;
      } else if (targetPrice === null && latestSnapshots.length > 1) {
        const prevPrice = Number(latestSnapshots[1].price);
        if (currentPrice < prevPrice) {
          isTriggered = true;
        }
      }

      if (isTriggered) {
        await this.prisma.alert.update({
          where: { id: alert.id },
          data: { status: 'triggered' },
        });

        // Trigger notification email (uses Resend in prod, dev-mode console fallback if no key)
        await this.notificationsService.sendPriceAlertEmail(
          alert.user.email,
          alert.product.canonicalTitle,
          currentPrice,
          targetPrice || undefined,
        );

        triggeredCount++;
      }
    }

    return {
      evaluated: activeAlerts.length,
      triggered: triggeredCount,
    };
  }
}
