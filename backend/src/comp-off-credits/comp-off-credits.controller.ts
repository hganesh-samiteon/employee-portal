import { Body, Controller, Post } from '@nestjs/common';

import { CompOffCreditsService } from './comp-off-credits.service.js';
import { CreateCompOffCreditDto } from './dto/create-comp-off-credit.dto.js';

@Controller('comp-off-credits')
export class CompOffCreditsController {
  constructor(private readonly compOffCreditsService: CompOffCreditsService) {}

  @Post()
  createCredit(@Body() dto: CreateCompOffCreditDto) {
    return this.compOffCreditsService.createCredit(dto);
  }
}
