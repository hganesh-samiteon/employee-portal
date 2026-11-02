import { Module } from '@nestjs/common';
import { LeavePolicyConfigurationsService } from './leave-policy-configurations.service.js';
import { LeavePolicyConfigurationsController } from './leave-policy-configurations.controller.js';

@Module({
  providers: [LeavePolicyConfigurationsService],
  controllers: [LeavePolicyConfigurationsController]
})
export class LeavePolicyConfigurationsModule {}
