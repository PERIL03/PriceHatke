import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { QueryDealsDto } from './dto/query-deals.dto';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  getDeals(@Query() query: QueryDealsDto) {
    return this.dealsService.getDeals(query);
  }

  @Get(':id')
  getDealById(@Param('id') id: string) {
    return this.dealsService.getDealById(id);
  }

  @Post()
  createDeal(@Body() dto: CreateDealDto) {
    return this.dealsService.createDeal(dto);
  }
}
