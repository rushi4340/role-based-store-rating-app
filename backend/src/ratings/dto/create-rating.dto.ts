import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsInt()
  storeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating: number;
}
