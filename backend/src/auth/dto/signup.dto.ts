import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class SignupDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(60, { message: 'Name cannot exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(30)
  password: string;

  @IsString()
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN, USER, or STORE_OWNER' })
  role?: Role;
}
