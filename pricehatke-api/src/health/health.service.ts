import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private redisClient: Redis | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    try {
      const redisUrl =
        this.configService.get<string>('REDIS_URL') ||
        'redis://default:password@localhost:6379';
      this.redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });
    } catch {
      this.redisClient = null;
    }
  }

  async check() {
    let db = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = true;
    } catch {
      db = false;
    }

    let redis = false;
    if (this.redisClient) {
      try {
        await this.redisClient.connect();
        const ping = await this.redisClient.ping();
        redis = ping === 'PONG';
      } catch {
        redis = false;
      } finally {
        this.redisClient.disconnect();
      }
    }

    return {
      status: 'ok',
      db,
      redis,
    };
  }
}
