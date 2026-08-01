import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AmazonProvider } from './providers/amazon.provider';
import { FlipkartProvider } from './providers/flipkart.provider';
import { GenericProvider } from './providers/generic.provider';
import { ProviderFactory } from './providers/provider.factory';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    AmazonProvider,
    FlipkartProvider,
    GenericProvider,
    ProviderFactory,
  ],
  exports: [ProductsService, ProviderFactory],
})
export class ProductsModule {}
