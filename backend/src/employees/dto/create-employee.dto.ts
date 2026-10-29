import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'employeeCode must contain only uppercase letters, numbers, underscores, or hyphens',
  })
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsDateString({ strict: true })
  joiningDate: string;

  @IsInt()
  @Min(1)
  departmentId: number;

  @IsInt()
  @Min(1)
  designationId: number;
}
