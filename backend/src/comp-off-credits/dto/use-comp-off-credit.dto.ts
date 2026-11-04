import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UseCompOffCreditDto {
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  days: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}
