import React from 'react';
import { WeatherData } from '../types/weather';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTemperatureUnit } from '../hooks/useTemperatureUnit';
import { useI18n } from '../hooks/useI18n';

interface WeatherCardProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  isFavorite,
  onToggleFavorite,
}) => {
  const { location, current } = weather;
  const { unit, toggleUnit } = useTemperatureUnit();
  const { t } = useI18n();

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-3xl text-gray-900 dark:text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="bg-purple-600 text-xs px-3 py-1 rounded-full mr-2">{location.country}</span>
            <span className="text-lg font-semibold">{location.name}</span>
          </div>
          <div className="text-3xl font-bold mb-1">{unit === 'celsius' ? `${current.temp_c}°C` : `${current.temp_f}°F`}</div>
          <div className="text-sm text-gray-300 mb-2">{new Date(location.localtime).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <span>{t('high')}: {unit === 'celsius' ? `${current.temp_c + 3}°C` : `${current.temp_f + 5}°F`}</span>
            <span>{t('low')}: {unit === 'celsius' ? `${current.temp_c - 3}°C` : `${current.temp_f - 5}°F`}</span>
            <span>{t('feels_like')}: {unit === 'celsius' ? `${current.feelslike_c}°C` : `${current.feelslike_f}°F`}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={onToggleFavorite}
            className="p-2 focus:outline-none transition-colors duration-200"
            title="Toggle Favorite"
          >
            {isFavorite ? (
              <StarIconSolid className="h-8 w-8 text-yellow-400" />
            ) : (
              <StarIcon className="h-8 w-8 text-white hover:text-yellow-400" />
            )}
          </button>
          <div className="flex items-center mt-2">
            <button
              onClick={toggleUnit}
              className="bg-gray-700 px-2 py-1 rounded-full text-xs font-semibold mr-2 focus:outline-none"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
            <img
              src={`https:${current.condition.icon}`}
              alt={current.condition.text}
              className="w-16 h-16"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <div className="flex flex-col items-start mb-4 md:mb-0">
          <span className="text-2xl font-bold mb-1">{current.condition.text}</span>
          <span className="text-sm text-gray-300">{t('wind')}: {current.wind_kph} km/h {current.wind_dir}</span>
          <span className="text-sm text-gray-300">{t('humidity')}: {current.humidity}%</span>
          <span className="text-sm text-gray-300">{t('pressure')}: {current.pressure_mb} mb</span>
          <span className="text-sm text-gray-300">{t('visibility')}: {current.vis_km} km</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-400">{t('updated')}: {current.last_updated}</span>
        </div>
      </div>
    </div>
  );
}; 