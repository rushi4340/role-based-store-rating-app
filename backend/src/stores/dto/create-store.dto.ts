import { IsEmail, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(3, { message: 'Store name must be at least 3 characters' })
  @MaxLength(60, { message: 'Store name cannot exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid contact email for the store' })
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(10, { message: 'Address must be at least 10 characters' })
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address: string;
}
