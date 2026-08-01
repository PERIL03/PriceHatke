import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'PriceHatke API',
      status: 'online',
      version: '1.0.0',
      health: '/health',
      docs: '/api/docs',
    };
  }
}
