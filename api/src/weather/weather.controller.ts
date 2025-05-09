import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('weather')

export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string) {

    return this.weatherService.getWeather(city);
  }

  @Get('autocomplete')
  async getCitySuggestions(@Query('query') query: string) {
    return this.weatherService.getCitySuggestions(query);
  }

  @Get('popular')
  async getPopularCities() {
    return this.weatherService.getPopularCities();
  }
}
