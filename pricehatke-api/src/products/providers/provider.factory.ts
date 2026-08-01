import { Injectable } from '@nestjs/common';
import { IStoreProvider } from './store-provider.interface';
import { AmazonProvider } from './amazon.provider';
import { FlipkartProvider } from './flipkart.provider';
import { GenericProvider } from './generic.provider';

@Injectable()
export class ProviderFactory {
  private readonly providers: IStoreProvider[];

  constructor(
    private readonly amazonProvider: AmazonProvider,
    private readonly flipkartProvider: FlipkartProvider,
    private readonly genericProvider: GenericProvider,
  ) {
    this.providers = [this.amazonProvider, this.flipkartProvider, this.genericProvider];
  }

  getProvider(url: string): IStoreProvider {
    const provider = this.providers.find((p) => p.storeName !== 'generic' && p.canHandle(url));
    return provider || this.genericProvider;
  }

  getProviderByName(storeName: string): IStoreProvider {
    const provider = this.providers.find((p) => p.storeName.toLowerCase() === storeName.toLowerCase());
    return provider || this.genericProvider;
  }
}
