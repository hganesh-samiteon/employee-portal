import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { CompOffCreditSource } from '../comp-off-credit.entity.js';

export class CreateCompOffCreditDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsDateString()
  sourceDate: string;

  @IsEnum(CompOffCreditSource)
  sourceType: CompOffCreditSource;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  approvedHours: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  remarks: string;
}
