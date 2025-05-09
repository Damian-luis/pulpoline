import { useState, useCallback, useEffect } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

export const useTemperatureUnit = () => {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  const toggleUnit = useCallback(() => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    localStorage.setItem('temperatureUnit', newUnit);
  }, [unit]);

  return {
    unit,
    toggleUnit,
  };
}; 