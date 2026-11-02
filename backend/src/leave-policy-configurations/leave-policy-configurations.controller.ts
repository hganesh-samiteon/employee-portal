import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { LeavePolicyConfigurationsService } from './leave-policy-configurations.service.js';
import { CreateLeavePolicyConfigurationDto } from './dto/create-leave-policy-configuration.dto.js';

@Controller('leave-policy-configurations')
export class LeavePolicyConfigurationsController {
  constructor(
    private readonly leavePolicyConfigurationsService: LeavePolicyConfigurationsService,
  ) {}

  @Post()
  create(
    @Body()
    createLeavePolicyConfigurationDto: CreateLeavePolicyConfigurationDto,
  ) {
    return this.leavePolicyConfigurationsService.create(
      createLeavePolicyConfigurationDto,
    );
  }

  @Get()
  findAll() {
    return this.leavePolicyConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leavePolicyConfigurationsService.findOne(id);
  }
}
