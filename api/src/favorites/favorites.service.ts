import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavoriteCity } from '../common/types/weather.types';
import { FavoriteCity as FavoriteCityModel } from './schemas/favorite-city.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(FavoriteCityModel.name) private favoriteModel: Model<FavoriteCity>,
  ) {}

  async getFavorites(userId: string): Promise<FavoriteCity[]> {
    return this.favoriteModel.find({ userId }).exec();
  }

  async addFavorite(userId: string, city: string): Promise<FavoriteCity> {
    const favorite = new this.favoriteModel({
      userId,
      city,
      createdAt: new Date(),
    });
    return favorite.save();
  }

  async removeFavorite(userId: string, city: string): Promise<void> {
    await this.favoriteModel.deleteOne({ userId, city }).exec();
  }
}
