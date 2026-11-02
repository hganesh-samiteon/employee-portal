import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message:
      'Code must be uppercase and contain only letters, numbers, and underscores',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
