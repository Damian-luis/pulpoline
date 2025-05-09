import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.userId);
  }

  @Post(':city')
  async addFavorite(@Request() req, @Param('city') city: string) {
    return this.favoritesService.addFavorite(req.user.userId, city);
  }

  @Delete(':city')
  async removeFavorite(@Request() req, @Param('city') city: string) {
    return this.favoritesService.removeFavorite(req.user.userId, city);
  }
}
