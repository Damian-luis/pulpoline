import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FavoriteCity extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FavoriteCitySchema = SchemaFactory.createForClass(FavoriteCity);