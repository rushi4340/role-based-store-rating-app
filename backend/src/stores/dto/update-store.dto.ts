import { IsEmail, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Store name must be at least 3 characters' })
  @MaxLength(60, { message: 'Store name cannot exceed 60 characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid contact email for the store' })
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Address must be at least 10 characters' })
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address?: string;
}
