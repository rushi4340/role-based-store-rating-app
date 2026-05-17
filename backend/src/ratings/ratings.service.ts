import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto, userId: number) {
    const { storeId, rating } = createRatingDto;

    // 1. Verify the store exists
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    // 2. Check if the user already rated this store
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this store');
    }

    // 3. Create the rating
    return this.prisma.rating.create({
      data: {
        rating,
        storeId,
        userId,
      },
    });
  }
}
