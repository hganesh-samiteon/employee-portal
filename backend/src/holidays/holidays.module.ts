import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Holiday } from './holiday.entity.js';
import { HolidaysController } from './holidays.controller.js';
import { HolidaysService } from './holidays.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  controllers: [HolidaysController],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
