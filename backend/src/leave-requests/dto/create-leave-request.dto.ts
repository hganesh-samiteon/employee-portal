import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDateString,
  IsEnum,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

import { HalfDaySession } from '../enums/half-day-session.enum.js';

export class CreateLeaveRequestDto {
  @IsInt()
  @Min(1)
  leaveTypeId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  isHalfDay: boolean;

  @ValidateIf((o) => o.isHalfDay === true)
  @IsNotEmpty()
  @IsEnum(HalfDaySession)
  halfDaySession?: HalfDaySession;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
