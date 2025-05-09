import React from 'react';
import { WeatherData } from '../types/weather';
import { useTemperatureUnit } from '../hooks/useTemperatureUnit';
import { useI18n } from '../hooks/useI18n';

interface WeatherTableViewProps {
  weather: WeatherData;
}

export const WeatherTableView: React.FC<WeatherTableViewProps> = ({ weather }) => {
  const { unit } = useTemperatureUnit();
  const { location, current } = weather;
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('city')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('temperature')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('condition')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wind')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('humidity')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('local_time')}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{location.name}</div>
              <div className="text-sm text-gray-500">
                {location.region}, {location.country}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {unit === 'celsius' ? `${current.temp_c}°C` : `${current.temp_f}°F`}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <img
                  src={`https:${current.condition.icon}`}
                  alt={current.condition.text}
                  className="w-8 h-8 mr-2"
                />
                <span className="text-sm text-gray-900">{current.condition.text}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{current.wind_kph} km/h</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{current.humidity}%</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {new Date(location.localtime).toLocaleString()}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}; 