import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherCard } from '../WeatherCard';
import { WeatherData } from '../../types/weather';

describe('WeatherCard', () => {
  const mockWeather: WeatherData = {
    location: {
      name: 'London',
      region: 'City of London',
      country: 'United Kingdom',
      lat: 51.5074,
      lon: -0.1278,
      tz_id: 'Europe/London',
      localtime_epoch: 1620000000,
      localtime: new Date().toISOString(),
    },
    current: {
      last_updated_epoch: 1620000000,
      last_updated: new Date().toISOString(),
      temp_c: 20,
      temp_f: 68,
      is_day: 1,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        code: 1000,
      },
      wind_mph: 9.3,
      wind_kph: 15,
      wind_degree: 180,
      wind_dir: 'S',
      pressure_mb: 1012,
      pressure_in: 29.88,
      precip_mm: 0,
      precip_in: 0,
      humidity: 65,
      cloud: 0,
      feelslike_c: 20,
      feelslike_f: 68,
      windchill_c: 20,
      windchill_f: 68,
      heatindex_c: 20,
      heatindex_f: 68,
      dewpoint_c: 13,
      dewpoint_f: 55.4,
      vis_km: 10,
      vis_miles: 6,
      uv: 5,
      gust_mph: 12,
      gust_kph: 19,
    }
  };

  it('renders weather information correctly', () => {
    render(
      <WeatherCard 
        weather={mockWeather} 
        isFavorite={false} 
        onToggleFavorite={() => {}} 
      />
    );
    
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('displays temperature in both Celsius and Fahrenheit', () => {
    render(
      <WeatherCard 
        weather={mockWeather} 
        isFavorite={false} 
        onToggleFavorite={() => {}} 
      />
    );
    
    const celsius = screen.getByText('20°C');
    const fahrenheit = screen.getByText('68°F');
    
    expect(celsius).toBeInTheDocument();
    expect(fahrenheit).toBeInTheDocument();
  });
}); 