import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompOffCredit } from './comp-off-credit.entity.js';
import { CompOffTransaction } from './comp-off-transaction.entity.js';
import { Employee } from '../employees/employee.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompOffCredit, CompOffTransaction, Employee]),
  ],
})
export class CompOffCreditsModule {}
