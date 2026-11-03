import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateCompOffEligibilityDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  departmentId?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  designationId?: number | null;

  @IsOptional()
  @IsBoolean()
  isEligible?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string | null;
}
