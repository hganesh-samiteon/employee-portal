import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CompOffEligibilityService } from './comp-off-eligibility.service.js';
import { CreateCompOffEligibilityDto } from './dto/create-comp-off-eligibility.dto.js';
import { UpdateCompOffEligibilityDto } from './dto/update-comp-off-eligibility.dto.js';

@Controller('comp-off-eligibility')
export class CompOffEligibilityController {
  constructor(
    private readonly compOffEligibilityService: CompOffEligibilityService,
  ) {}

  @Post()
  create(@Body() dto: CreateCompOffEligibilityDto) {
    return this.compOffEligibilityService.create(dto);
  }

  @Get()
  findAll() {
    return this.compOffEligibilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.compOffEligibilityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompOffEligibilityDto,
  ) {
    return this.compOffEligibilityService.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.compOffEligibilityService.deactivate(id);
  }
}
