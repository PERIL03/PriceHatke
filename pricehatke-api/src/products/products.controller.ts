import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ResolveProductDto } from './dto/resolve-product.dto';
import { PriceHistoryQueryDto } from './dto/price-history-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('resolve')
  resolve(@Body() dto: ResolveProductDto) {
    return this.productsService.resolve(dto.input);
  }

  @Get(':id')
  getProductDetail(@Param('id') id: string) {
    return this.productsService.getProductDetail(id);
  }

  @Get(':id/history')
  getPriceHistory(@Param('id') id: string, @Query() query: PriceHistoryQueryDto) {
    return this.productsService.getPriceHistory(id, query.range, query.store);
  }

  @Get(':id/compare')
  getStoreComparison(@Param('id') id: string) {
    return this.productsService.getStoreComparison(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/track')
  trackProduct(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.productsService.trackProduct(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/track')
  untrackProduct(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.productsService.untrackProduct(userId, id);
  }
}
