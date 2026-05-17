import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('USER', 'ADMIN') // Store owners shouldn't rate stores
  @Post()
  create(@Body() createRatingDto: CreateRatingDto, @CurrentUser() user: any) {
    return this.ratingsService.create(createRatingDto, user.sub);
  }
}
