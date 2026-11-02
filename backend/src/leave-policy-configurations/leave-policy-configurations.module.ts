import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeavePolicyConfiguration } from './leave-policy-configuration.entity.js';
import { LeavePolicyConfigurationsController } from './leave-policy-configurations.controller.js';
import { LeavePolicyConfigurationsService } from './leave-policy-configurations.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([LeavePolicyConfiguration])],
  controllers: [LeavePolicyConfigurationsController],
  providers: [LeavePolicyConfigurationsService],
  exports: [LeavePolicyConfigurationsService],
})
export class LeavePolicyConfigurationsModule {}
