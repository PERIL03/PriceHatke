import { Injectable } from '@nestjs/common';
import { IStoreProvider, PricePoint, ResolvedProduct } from './store-provider.interface';
import * as mockData from '../fixtures/mock-store-data.json';

@Injectable()
export class GenericProvider implements IStoreProvider {
  readonly storeName = 'generic';

  canHandle(url: string): boolean {
    return true; // Fallback provider
  }

  async resolve(url: string): Promise<ResolvedProduct> {
    const item = mockData.generic;
    const cleanTitle = url.split('/').pop()?.replace(/-/g, ' ') || item.title;

    return {
      store: this.storeName,
      storeProductId: `GENERIC-${Math.abs(url.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)) % 10000}`,
      storeUrl: url.startsWith('http') ? url : `https://example.com/product`,
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      category: item.category,
      imageUrl: item.imageUrl,
      currentPrice: item.currentPrice,
      mrp: item.mrp,
    };
  }

  async fetchPrice(storeProductId: string): Promise<PricePoint> {
    const item = mockData.generic;
    return {
      storeProductId,
      price: item.currentPrice,
      mrp: item.mrp,
      capturedAt: new Date(),
    };
  }
}
