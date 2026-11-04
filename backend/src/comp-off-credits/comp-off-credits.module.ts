import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompOffCredit } from './comp-off-credit.entity.js';
import { CompOffTransaction } from './comp-off-transaction.entity.js';
import { Employee } from '../employees/employee.entity.js';
import { CompOffCreditsService } from './comp-off-credits.service.js';
import { CompOffCreditsController } from './comp-off-credits.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompOffCredit, CompOffTransaction, Employee]),
  ],
  providers: [CompOffCreditsService],
  controllers: [CompOffCreditsController],
})
export class CompOffCreditsModule {}
