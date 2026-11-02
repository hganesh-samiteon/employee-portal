import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveType } from './leave-type.entity.js';
import { LeaveTypesController } from './leave-types.controller.js';
import { LeaveTypesService } from './leave-types.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType])],
  controllers: [LeaveTypesController],
  providers: [LeaveTypesService],
  exports: [LeaveTypesService],
})
export class LeaveTypesModule {}
