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
      toast.error('Error al obtener las ciudades favoritas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (city: string) => {
    try {
      const newFavorite = await api.addFavorite(city);
      setFavorites(prev => [...prev, newFavorite]);
      toast.success('Ciudad agregada a favoritos');
    } catch {
      toast.error('Error al agregar a favoritos');
    }
  }, []);

  const removeFavorite = useCallback(async (city: string) => {
    try {
      await api.removeFavorite(city);
      setFavorites(prev => prev.filter(fav => fav.city !== city));
      toast.success('Ciudad eliminada de favoritos');
    } catch {
      toast.error('Error al eliminar de favoritos');
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