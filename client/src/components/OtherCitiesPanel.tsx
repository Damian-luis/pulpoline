import React, { useState } from 'react';
import { WeatherData } from '../types/weather';
import { useI18n } from '../hooks/useI18n';

interface OtherCitiesPanelProps {
  cities: WeatherData[];
  onSelect: (city: string) => void;
}

export const OtherCitiesPanel: React.FC<OtherCitiesPanelProps> = ({ cities, onSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useI18n();

  const CityRow = ({ citiesToShow }: { citiesToShow: WeatherData[] }) => (
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {citiesToShow.map((city) => (
        <div
          key={city.location.name}
          className="bg-gray-100 dark:bg-gray-800 min-w-[180px] max-w-[200px] rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => onSelect(city.location.name)}
        >
          <span className="text-2xl font-bold">{Math.round(city.current.temp_c)}°</span>
          <span className="text-xs text-gray-300 mb-2">
            H{Math.round(city.current.temp_c + 3)}° L{Math.round(city.current.temp_c - 3)}°
          </span>
          <span className="text-sm font-medium">{city.location.name}</span>
          <img
            src={`https:${city.current.condition.icon}`}
            alt={city.current.condition.text}
            className="w-8 h-8 mt-2"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 shadow text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">{t('other_cities')}</span>
        <button
          className="text-xs text-gray-400 hover:text-white transition"
          onClick={() => setShowModal(true)}
        >
          {t('show_all')}
        </button>
      </div>
      <CityRow citiesToShow={cities.slice(0, 4)} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-3xl relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6 text-white">{t('all_cities')}</h2>
            <CityRow citiesToShow={cities} />
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}; 