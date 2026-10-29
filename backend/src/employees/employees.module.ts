import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
})
export class EmployeesModule {}
