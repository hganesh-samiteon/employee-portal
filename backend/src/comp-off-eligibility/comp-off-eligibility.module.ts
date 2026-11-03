import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompOffEligibility } from './comp-off-eligibility.entity.js';
import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';
import { CompOffEligibilityController } from './comp-off-eligibility.controller.js';
import { CompOffEligibilityService } from './comp-off-eligibility.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompOffEligibility, Department, Designation]),
  ],
  controllers: [CompOffEligibilityController],
  providers: [CompOffEligibilityService],
})
export class CompOffEligibilityModule {}
