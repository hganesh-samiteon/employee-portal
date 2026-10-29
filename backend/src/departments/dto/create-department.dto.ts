import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'code must contain only uppercase letters, numbers, underscores, or hyphens',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;
}
