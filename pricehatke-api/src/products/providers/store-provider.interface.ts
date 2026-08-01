export interface ResolvedProduct {
  store: string;
  storeProductId: string;
  storeUrl: string;
  title: string;
  category?: string;
  imageUrl?: string;
  currentPrice: number;
  mrp?: number;
}

export interface PricePoint {
  storeProductId: string;
  price: number;
  mrp?: number;
  capturedAt: Date;
}

export interface IStoreProvider {
  storeName: string;
  canHandle(url: string): boolean;
  resolve(url: string): Promise<ResolvedProduct>;
  fetchPrice(storeProductId: string): Promise<PricePoint>;
}
