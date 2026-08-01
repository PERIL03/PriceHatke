import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@GetUser('id') userId: string, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserAlerts(@GetUser('id') userId: string) {
    return this.alertsService.getUserAlerts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteAlert(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.alertsService.deleteAlert(userId, id);
  }

  @Post('evaluate')
  evaluateAlerts() {
    return this.alertsService.evaluateAlerts();
  }
}
