import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CompOffCreditsService } from './comp-off-credits.service.js';
import { CreateCompOffCreditDto } from './dto/create-comp-off-credit.dto.js';
import { UseCompOffCreditDto } from './dto/use-comp-off-credit.dto.js';

@Controller('comp-off-credits')
export class CompOffCreditsController {
  constructor(private readonly compOffCreditsService: CompOffCreditsService) {}

  @Post()
  createCredit(@Body() dto: CreateCompOffCreditDto) {
    return this.compOffCreditsService.createCredit(dto);
  }

  @Get('employee/:employeeId/balance')
  getEmployeeBalance(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.compOffCreditsService.getEmployeeBalance(employeeId);
  }

  @Get('employee/:employeeId/transactions')
  getEmployeeTransactions(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.compOffCreditsService.getEmployeeTransactions(employeeId);
  }

  @Post('employee/:employeeId/use')
  useCompOffCredit(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() dto: UseCompOffCreditDto,
  ) {
    return this.compOffCreditsService.useCompOffCredit(employeeId, dto);
  }

  @Post('process-expired')
  processExpiredCredits() {
    return this.compOffCreditsService.processExpiredCredits();
  }
}
