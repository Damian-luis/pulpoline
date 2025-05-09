import React from 'react';
import { WeatherData } from '../types/weather';
import { useI18n } from '../hooks/useI18n';

interface WeatherHighlightsProps {
  weather: WeatherData;
}

export const WeatherHighlights: React.FC<WeatherHighlightsProps> = ({ weather }) => {
  const { current } = weather;
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-purple-900 dark:to-indigo-800 rounded-xl p-6 flex flex-col items-center text-gray-900 dark:text-white shadow">
        <span className="text-lg font-semibold mb-2">{t('uv_index')}</span>
        <span className="text-3xl font-bold">{current.uv}</span>
      </div>
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-700 rounded-xl p-6 flex flex-col items-center text-gray-900 dark:text-white shadow">
        <span className="text-lg font-semibold mb-2">{t('wind')}</span>
        <span className="text-3xl font-bold">{current.wind_kph} km/h</span>
        <span className="text-sm">{current.wind_dir}</span>
      </div>
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-yellow-700 dark:to-yellow-500 rounded-xl p-6 flex flex-col items-center text-gray-900 dark:text-white shadow">
        <span className="text-lg font-semibold mb-2">{t('humidity')}</span>
        <span className="text-3xl font-bold">{current.humidity}%</span>
      </div>
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-600 rounded-xl p-6 flex flex-col items-center text-gray-900 dark:text-white shadow">
        <span className="text-lg font-semibold mb-2">{t('pressure')}</span>
        <span className="text-3xl font-bold">{current.pressure_mb} mb</span>
      </div>
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-blue-800 dark:to-blue-500 rounded-xl p-6 flex flex-col items-center text-gray-900 dark:text-white shadow col-span-2 md:col-span-1">
        <span className="text-lg font-semibold mb-2">{t('visibility')}</span>
        <span className="text-3xl font-bold">{current.vis_km} km</span>
      </div>
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-indigo-800 dark:to-purple-700 rounded-xl p-6 flex flex-col items-center text-gray-900 dark:text-white shadow col-span-2 md:col-span-1">
        <span className="text-lg font-semibold mb-2">{t('cloud')}</span>
        <span className="text-3xl font-bold">{current.cloud}%</span>
      </div>
    </div>
  );
}; 