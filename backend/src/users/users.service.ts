import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any = {}) {
    const { name, email, address, role, search, sortBy, sortOrder } = query;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            ratings: true,
          }
        }
      },
    });
    
    // We need to return Store Owner's rating if applicable
    return users.map(user => {
      let storeRating = null;
      if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
        // Calculate average rating for their first store (or all stores)
        const allRatings = user.stores.flatMap(s => s.ratings);
        if (allRatings.length > 0) {
          const sum = allRatings.reduce((acc, curr) => acc + curr.rating, 0);
          storeRating = (sum / allRatings.length).toFixed(1);
        }
      }
      return {
        ...user,
        storeRating
      };
    });
  }
}
