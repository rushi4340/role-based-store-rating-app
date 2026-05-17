import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto, userId: number) {
    return this.prisma.store.create({
      data: {
        ...createStoreDto,
        ownerId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.store.findMany({
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
}
