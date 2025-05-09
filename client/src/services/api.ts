import axios from 'axios';
import { WeatherData, CitySuggestion, FavoriteCity } from '../types/weather';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  const { access_token } = response.data;
  return { token: access_token };
};

export const getWeather = async (city: string): Promise<WeatherData> => {
  const response = await api.get(`/weather?city=${encodeURIComponent(city)}`);
  return response.data;
};

export const getCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  const response = await api.get(`/weather/autocomplete?query=${query}`);
  return response.data;
};

export const getPopularCities = async (): Promise<WeatherData[]> => {
  const response = await api.get('/weather/popular');
  return response.data;
};

export const getFavorites = async (): Promise<FavoriteCity[]> => {
  const response = await api.get('/favorites');
  return response.data;
};

export const addFavorite = async (city: string): Promise<FavoriteCity> => {
  const response = await api.post(`/favorites/${city}`);
  return response.data;
};

export const removeFavorite = async (city: string): Promise<void> => {
  const response = await api.delete(`/favorites/${city}`);
  return response.data;
}; 