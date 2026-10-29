import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateDesignationDto } from './dto/create-designation.dto.js';
import { UpdateDesignationDto } from './dto/update-designation.dto.js';
import { DesignationsService } from './designations.service.js';

@Controller('designations')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designationsService.create(createDesignationDto);
  }

  @Get()
  findAll() {
    return this.designationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.designationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return this.designationsService.update(id, updateDesignationDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.designationsService.deactivate(id);
  }
}
