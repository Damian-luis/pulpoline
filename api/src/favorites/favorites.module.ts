import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FavoriteCity, FavoriteCitySchema } from './schemas/favorite-city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FavoriteCity.name, schema: FavoriteCitySchema },
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
