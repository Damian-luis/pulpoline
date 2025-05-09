import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { SearchInput } from '../components/SearchInput';
import { WeatherCard } from '../components/WeatherCard';
import { WeatherHighlights } from '../components/WeatherHighlights';
import { OtherCitiesPanel } from '../components/OtherCitiesPanel';
import { Layout } from '../components/Layout';
import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { TableCellsIcon, ListBulletIcon, LanguageIcon } from '@heroicons/react/24/outline';
import * as api from '../services/api';
import { useI18n } from '../hooks/useI18n';

import { WeatherData } from '../types/weather';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Home() {
  const { weather, suggestions, loading: weatherLoading, searchCity, getSuggestions } = useWeather();
  const { favorites, refreshFavorites, addFavorite, removeFavorite } = useFavorites();
  const { t, locale, setLocale, loading: i18nLoading } = useI18n();
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const [detailedView, setDetailedView] = useState(true);
  const [autoSelected, setAutoSelected] = useState(false);
  const [geoTried, setGeoTried] = useState(false);
  const [popularCities, setPopularCities] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPopularCities = useCallback(async () => {
    try {
      const cities = [t('london'), t('new_york'), t('tokyo'), t('paris'), t('sydney')];
      const weatherData = await Promise.all(
        cities.map(city => api.getWeather(city))
      );
      setPopularCities(weatherData);
    } catch (error) {
      console.error('Error fetching popular cities:', error);
    }
  }, [t]);

  const fetchWeatherHistory = useCallback(async () => {
    try {
      const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
      if (history.length > 0) {
        const lastCity = history[0].city;
        await api.getWeather(lastCity);
      }
    } catch (error) {
      console.error('Error fetching weather history:', error);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          refreshFavorites(),
          fetchPopularCities(),
          fetchWeatherHistory(),
        ]);
        const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
        if (favorites.length === 0 && (!history || history.length === 0)) {
          await searchCity('Costa Rica');
          setAutoSelected(true);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [refreshFavorites, fetchPopularCities, fetchWeatherHistory, favorites.length, searchCity]);

  useEffect(() => {
    if (favorites.length === 0) {
      api.getPopularCities().then(setPopularCities);
    }
  }, [favorites.length]);

  useEffect(() => {
    if (!weather && !autoSelected) {
      if (favorites.length > 0) {
        searchCity(favorites[0].city);
        setAutoSelected(true);
      } else if (!geoTried && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            searchCity(`${latitude},${longitude}`);
            setAutoSelected(true);
            setGeoTried(true);
          },
          () => {
            if (popularCities.length > 0) {
              searchCity(popularCities[0].location.name);
              setAutoSelected(true);
            }
            setGeoTried(true);
          },
          { timeout: 5000 }
        );
      } else if (popularCities.length > 0) {
        searchCity(popularCities[0].location.name);
        setAutoSelected(true);
      }
    }
  }, [weather, favorites, popularCities, searchCity, autoSelected, geoTried]);

  const isFavorite = weather ? favorites.some((fav) => fav.city === weather.location.name) : false;

  const handleSearch = (city: string) => {
    searchCity(city);
    addToHistory(city);
    setAutoSelected(true);
  };

  const handleToggleFavorite = () => {
    if (!weather) return;
    if (isFavorite) {
      removeFavorite(weather.location.name);
    } else {
      addFavorite(weather.location.name);
    }
  };

  const otherCitiesWeather = useMemo(() => {
    if (weather) {
      if (favorites.length > 0) {
        return favorites
          .filter((fav) => fav.city !== weather.location.name)
          .map((fav) => ({
            ...weather,
            location: { ...weather.location, name: fav.city },
          })) as WeatherData[];
      } else if (popularCities.length > 0) {
        return popularCities.filter((c) => c.location.name !== weather.location.name);
      }
    }
    return [] as WeatherData[];
  }, [favorites, weather, popularCities]);

  const FloatingButtons = () => (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">

      <button
        onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
        className="bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition"
        title={t('language_toggle')}
      >
        <LanguageIcon className="h-6 w-6" />
      </button>
    </div>
  );

  return (
    <Layout>
      <FloatingButtons />
      <div className="min-h-screen bg-gray-900 text-white">
        {isLoading && <LoadingSpinner />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">{t('title')}</h1>
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-xl">
              {i18nLoading ? (
                <div className="flex justify-center items-center h-16">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                </div>
              ) : (
                <SearchInput
                  onSearch={handleSearch}
                  onSuggestionsChange={getSuggestions}
                  suggestions={suggestions}
                  loading={weatherLoading}
                />
              )}
            </div>
          </div>

          {weather && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setDetailedView((v) => !v)}
                className="p-2 text-gray-300 hover:text-white bg-gray-800 rounded-full focus:outline-none transition-colors duration-200 flex items-center"
                title={detailedView ? t('show_all') : t('all_cities')}
              >
                {detailedView ? (
                  <ListBulletIcon className="h-6 w-6" />
                ) : (
                  <TableCellsIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          )}

          {weather ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2 flex flex-col gap-8">
                <WeatherCard
                  weather={weather}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
                {detailedView && <WeatherHighlights weather={weather} />}
              </div>
              <div className="flex flex-col gap-8">
                {detailedView && <OtherCitiesPanel cities={otherCitiesWeather} onSelect={handleSearch} />}
                {history.length > 0 && (
                  <div className="bg-gray-800 rounded-xl shadow p-6 text-white mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">{i18nLoading ? <span className="inline-block w-24 h-4 bg-gray-700 rounded animate-pulse" /> : t('recent_searches')}</span>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-gray-400 hover:text-white transition"
                      >
                        {i18nLoading ? <span className="inline-block w-16 h-3 bg-gray-700 rounded animate-pulse" /> : t('clear_history')}
                      </button>
                    </div>
                    {i18nLoading ? (
                      <div className="flex justify-center items-center h-16">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {history.map((item) => (
                          <div
                            key={item.timestamp}
                            className="flex justify-between items-center bg-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-600 transition"
                            onClick={() => handleSearch(item.city)}
                          >
                            <span className="text-white">{item.city}</span>
                            <span className="text-xs text-gray-300">{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2 flex flex-col gap-8">
                <div className="flex flex-col items-center justify-center h-64 bg-gray-800 dark:bg-gray-100 rounded-2xl shadow-xl text-gray-400 dark:text-gray-600">
                  <span className="text-2xl mb-2">{t('no_weather_data')}</span>
                  <span className="text-sm">{t('search_to_see_weather')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-8">
                {otherCitiesWeather.length > 0 && (
                  <OtherCitiesPanel cities={otherCitiesWeather} onSelect={handleSearch} />
                )}
                {history.length > 0 && (
                  <div className="bg-gray-800 rounded-xl shadow p-6 text-white mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">{i18nLoading ? <span className="inline-block w-24 h-4 bg-gray-700 rounded animate-pulse" /> : t('recent_searches')}</span>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-gray-400 hover:text-white transition"
                      >
                        {i18nLoading ? <span className="inline-block w-16 h-3 bg-gray-700 rounded animate-pulse" /> : t('clear_history')}
                      </button>
                    </div>
                    {i18nLoading ? (
                      <div className="flex justify-center items-center h-16">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {history.map((item) => (
                          <div
                            key={item.timestamp}
                            className="flex justify-between items-center bg-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-600 transition"
                            onClick={() => handleSearch(item.city)}
                          >
                            <span className="text-white">{item.city}</span>
                            <span className="text-xs text-gray-300">{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
