import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveRequest } from './leave-request.entity.js';
import { LeaveDurationService } from './leave-duration.service.js';
import { LeaveRequestsController } from './leave-requests.controller.js';
import { Holiday } from '../holidays/holiday.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest, Holiday])],
  controllers: [LeaveRequestsController],
  providers: [LeaveDurationService],
})
export class LeaveRequestsModule {}
