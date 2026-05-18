import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto & { ownerId?: string | number }, userId: number, userRole?: string) {
    const { ownerId, ...storeData } = createStoreDto;
    
    // If admin is creating it and specified an ownerId, use it. Otherwise, fallback to the creator's ID.
    const finalOwnerId = (userRole === 'ADMIN' && ownerId) ? Number(ownerId) : userId;

    return this.prisma.store.create({
      data: {
        ...storeData,
        ownerId: finalOwnerId,
      },
    });
  }

  async findAll(query: any = {}) {
    const { search, sortBy, sortOrder } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc'; // Default sorting
    }

    return this.prisma.store.findMany({
      where,
      orderBy,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        ratings: true,
      },
    });
  }

  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        ratings: true,
      },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto, userId: number, userRole: string) {
    const store = await this.findOne(id);

    // Only the owner or an ADMIN can update the store
    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own stores');
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const store = await this.findOne(id);

    // Only the owner or an ADMIN can delete the store
    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own stores');
    }

    return this.prisma.store.delete({
      where: { id },
    });
  }

  async getOwnerDashboard(ownerId: number) {
    // Get all stores owned by this user
    const stores = await this.prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (stores.length === 0) {
      return { message: "You don't have any stores yet.", stores: [] };
    }

    // Since a store owner might have multiple stores, return the array
    // but also pre-calculate the average rating for each store
    const dashboardData = stores.map(store => {
      let averageRating = 0;
      if (store.ratings.length > 0) {
        const sum = store.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        averageRating = Number((sum / store.ratings.length).toFixed(1));
      }

      return {
        id: store.id,
        name: store.name,
        averageRating,
        totalRatings: store.ratings.length,
        ratings: store.ratings.map(r => ({
          ratingId: r.id,
          ratingValue: r.rating,
          createdAt: r.createdAt,
          user: r.user
        }))
      };
    });

    return dashboardData;
  }
}
