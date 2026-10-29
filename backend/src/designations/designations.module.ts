import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './designations.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Designation])],
})
export class DesignationsModule {}
export { Designation };
