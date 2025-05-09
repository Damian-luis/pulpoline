import { useState, useCallback, useEffect } from 'react';
import { FavoriteCity } from '../types/weather';
import * as api from '../services/api';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getFavorites();
      setFavorites(data);
    } catch {
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (city: string) => {
    try {
      const newFavorite = await api.addFavorite(city);
      setFavorites(prev => [...prev, newFavorite]);
      toast.success('City added to favorites');
    } catch {
      toast.error('Failed to add favorite');
    }
  }, []);

  const removeFavorite = useCallback(async (city: string) => {
    try {
      await api.removeFavorite(city);
      setFavorites(prev => prev.filter(fav => fav.city !== city));
      toast.success('City removed from favorites');
    } catch {
      toast.error('Failed to remove favorite');
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    refreshFavorites: fetchFavorites,
  };
}; 