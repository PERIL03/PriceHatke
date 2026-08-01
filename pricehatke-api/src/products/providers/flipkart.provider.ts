import { Injectable } from '@nestjs/common';
import { IStoreProvider, PricePoint, ResolvedProduct } from './store-provider.interface';
import * as mockData from '../fixtures/mock-store-data.json';

@Injectable()
export class FlipkartProvider implements IStoreProvider {
  readonly storeName = 'flipkart';

  canHandle(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes('flipkart.com') || lower.includes('/flipkart');
  }

  async resolve(url: string): Promise<ResolvedProduct> {
    const lowerUrl = url.toLowerCase();
    const items = mockData.flipkart;

    const matched = items.find((item) => lowerUrl.includes(item.urlKeyword)) || items[0];

    return {
      store: this.storeName,
      storeProductId: matched.storeProductId,
      storeUrl: url.startsWith('http') ? url : `https://flipkart.com/item/${matched.storeProductId}`,
      title: matched.title,
      category: matched.category,
      imageUrl: matched.imageUrl,
      currentPrice: matched.currentPrice,
      mrp: matched.mrp,
    };
  }

  async fetchPrice(storeProductId: string): Promise<PricePoint> {
    const item = mockData.flipkart.find((i) => i.storeProductId === storeProductId) || mockData.flipkart[0];
    const fluctuation = (Math.random() - 0.5) * 400;
    const price = Math.max(100, Math.round(item.currentPrice + fluctuation));

    return {
      storeProductId: item.storeProductId,
      price,
      mrp: item.mrp,
      capturedAt: new Date(),
    };
  }
}
