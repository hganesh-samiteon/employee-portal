import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveRequest } from './leave-request.entity.js';
import { LeaveRequestsService } from './leave-requests.service.js';
import { LeaveRequestsController } from './leave-requests.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest])],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
})
export class LeaveRequestsModule {}
