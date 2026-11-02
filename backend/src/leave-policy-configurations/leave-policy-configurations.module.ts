import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeavePolicyConfiguration } from './leave-policy-configuration.entity.js';
import { LeavePolicyConfigurationsController } from './leave-policy-configurations.controller.js';
import { LeavePolicyConfigurationsService } from './leave-policy-configurations.service.js';
import { LeaveType } from '../leave-types/leave-type.entity.js';
import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeavePolicyConfiguration,
      LeaveType,
      Department,
      Designation,
    ]),
  ],
  controllers: [LeavePolicyConfigurationsController],
  providers: [LeavePolicyConfigurationsService],
  exports: [LeavePolicyConfigurationsService],
})
export class LeavePolicyConfigurationsModule {}
