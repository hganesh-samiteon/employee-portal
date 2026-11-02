import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

import { EntitlementUnit } from '../enums/entitlement-unit.enum.js';
import { AllocationMode } from '../enums/allocation-mode.enum.js';
import { AccrualUnit } from '../enums/accrual-unit.enum.js';
import { AccrualBasisUnit } from '../enums/accrual-basis-unit.enum.js';
import { ProRataMethod } from '../enums/pro-rata-method.enum.js';

export class CreateLeavePolicyConfigurationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  leaveTypeId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  departmentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  designationId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(2026)
  policyYear: number;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  entitlementValue?: number;

  @IsOptional()
  @IsEnum(EntitlementUnit)
  entitlementUnit?: EntitlementUnit;

  @IsEnum(AllocationMode)
  allocationMode: AllocationMode;

  @IsOptional()
  @IsEnum(ProRataMethod)
  proRataMethod?: ProRataMethod;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  accrualValue?: number;

  @IsOptional()
  @IsEnum(AccrualUnit)
  accrualUnit?: AccrualUnit;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  accrualBasisValue?: number;

  @IsOptional()
  @IsEnum(AccrualBasisUnit)
  accrualBasisUnit?: AccrualBasisUnit;

  @IsOptional()
  @IsBoolean()
  allowHalfDay?: boolean;

  @IsOptional()
  @IsBoolean()
  carryForwardAllowed?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxCarryForward?: number;
}
