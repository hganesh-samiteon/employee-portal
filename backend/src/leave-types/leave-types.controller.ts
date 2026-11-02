import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { LeaveTypesService } from './leave-types.service.js';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto.js';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto.js';

@Controller('leave-types')
export class LeaveTypesController {
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  @Post()
  create(@Body() createLeaveTypeDto: CreateLeaveTypeDto) {
    return this.leaveTypesService.create(createLeaveTypeDto);
  }

  @Get()
  findAll() {
    return this.leaveTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaveTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto,
  ) {
    return this.leaveTypesService.update(id, updateLeaveTypeDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.leaveTypesService.deactivate(id);
  }
}
