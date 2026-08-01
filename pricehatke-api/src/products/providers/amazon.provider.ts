import { Injectable } from '@nestjs/common';
import { IStoreProvider, PricePoint, ResolvedProduct } from './store-provider.interface';
import * as mockData from '../fixtures/mock-store-data.json';

@Injectable()
export class AmazonProvider implements IStoreProvider {
  readonly storeName = 'amazon';

  canHandle(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes('amazon.in') || lower.includes('amazon.com') || lower.includes('/amazon');
  }

  async resolve(url: string): Promise<ResolvedProduct> {
    const lowerUrl = url.toLowerCase();
    const items = mockData.amazon;

    const matched = items.find((item) => lowerUrl.includes(item.urlKeyword)) || items[0];

    return {
      store: this.storeName,
      storeProductId: matched.storeProductId,
      storeUrl: url.startsWith('http') ? url : `https://amazon.in/dp/${matched.storeProductId}`,
      title: matched.title,
      category: matched.category,
      imageUrl: matched.imageUrl,
      currentPrice: matched.currentPrice,
      mrp: matched.mrp,
    };
  }

  async fetchPrice(storeProductId: string): Promise<PricePoint> {
    const item = mockData.amazon.find((i) => i.storeProductId === storeProductId) || mockData.amazon[0];

    // Simulating minor price fluctuation around current price
    const fluctuation = (Math.random() - 0.5) * 500;
    const price = Math.max(100, Math.round(item.currentPrice + fluctuation));

    return {
      storeProductId: item.storeProductId,
      price,
      mrp: item.mrp,
      capturedAt: new Date(),
    };
  }
}
