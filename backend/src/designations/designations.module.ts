import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Designation } from './designations.entity.js';
import { DesignationsController } from './designations.controller.js';
import { DesignationsService } from './designations.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Designation])],
  controllers: [DesignationsController],
  providers: [DesignationsService],
  exports: [DesignationsService],
})
export class DesignationsModule {}
