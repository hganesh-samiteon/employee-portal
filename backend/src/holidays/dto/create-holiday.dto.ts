import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name: string;

  @IsDateString({ strict: true })
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(['PUBLIC', 'COMPANY'])
  category: 'PUBLIC' | 'COMPANY';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;
}
