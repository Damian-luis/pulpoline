import { useState, useCallback } from 'react';
import { WeatherData, CitySuggestion } from '../types/weather';
import * as api from '../services/api';
import toast from 'react-hot-toast';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = useCallback(async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWeather(city);
      setWeather(data);
      const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
      const newHistory = [
        { city: data.location.name, timestamp: new Date().toISOString() },
        ...history,
      ].slice(0, 5);
      localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
    } catch {
      setError('Error al obtener los datos del clima');
      toast.error('Error al obtener los datos del clima');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await api.getCitySuggestions(query);
      setSuggestions(data);
    } catch {
      toast.error('Error al obtener las sugerencias de ciudades');
    }
  }, []);

  return {
    weather,
    suggestions,
    loading,
    error,
    searchCity,
    getSuggestions,
  };
}; 