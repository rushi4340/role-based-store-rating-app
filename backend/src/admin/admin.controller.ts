import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('dashboard')
  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalStores = await this.prisma.store.count();
    const totalRatings = await this.prisma.rating.count();

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }
}
