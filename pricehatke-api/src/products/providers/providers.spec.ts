import { AmazonProvider } from './amazon.provider';
import { FlipkartProvider } from './flipkart.provider';
import { ProviderFactory } from './provider.factory';
import { GenericProvider } from './generic.provider';

describe('Store Providers (Mock Abstraction)', () => {
  let amazonProvider: AmazonProvider;
  let flipkartProvider: FlipkartProvider;
  let genericProvider: GenericProvider;
  let factory: ProviderFactory;

  beforeEach(() => {
    amazonProvider = new AmazonProvider();
    flipkartProvider = new FlipkartProvider();
    genericProvider = new GenericProvider();
    factory = new ProviderFactory(amazonProvider, flipkartProvider, genericProvider);
  });

  it('AmazonProvider.resolve(url) returns deterministic mock product without network call', async () => {
    const url = 'https://www.amazon.in/dp/B09V3KXJPB?tag=pricehatke';
    const result = await amazonProvider.resolve(url);

    expect(result.store).toBe('amazon');
    expect(result.storeProductId).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.currentPrice).toBeGreaterThan(0);
  });

  it('AmazonProvider.fetchPrice(id) returns price point without network call', async () => {
    const pricePoint = await amazonProvider.fetchPrice('AMAZON-1001');

    expect(pricePoint.storeProductId).toBe('AMAZON-1001');
    expect(pricePoint.price).toBeGreaterThan(0);
    expect(pricePoint.capturedAt).toBeInstanceOf(Date);
  });

  it('ProviderFactory selects correct provider based on URL', () => {
    const amazon = factory.getProvider('https://amazon.in/iphone-15');
    const flipkart = factory.getProvider('https://flipkart.com/samsung-s24');
    const generic = factory.getProvider('https://unknownstore.com/item');

    expect(amazon.storeName).toBe('amazon');
    expect(flipkart.storeName).toBe('flipkart');
    expect(generic.storeName).toBe('generic');
  });
});
