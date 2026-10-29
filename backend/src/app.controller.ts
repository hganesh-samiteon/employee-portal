import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  checkHealth() {
    return {
      status: 'ok',
      message: 'Employee Portal API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
