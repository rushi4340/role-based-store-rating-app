import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'STORE_OWNER')
  @Post()
  create(@Body() createStoreDto: CreateStoreDto, @CurrentUser() user: any) {
    return this.storesService.create(createStoreDto, user.sub);
  }

  // Public route - anyone can view stores
  @Get()
  findAll(@Query() query: any) {
    return this.storesService.findAll(query);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('STORE_OWNER')
  @Get('owner/dashboard')
  getOwnerDashboard(@CurrentUser() user: any) {
    return this.storesService.getOwnerDashboard(user.sub);
  }

  // Public route
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.findOne(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'STORE_OWNER')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @CurrentUser() user: any,
  ) {
    return this.storesService.update(id, updateStoreDto, user.sub, user.role);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'STORE_OWNER')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.storesService.remove(id, user.sub, user.role);
  }
}
