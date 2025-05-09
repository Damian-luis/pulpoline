import { useState, useCallback, useEffect } from 'react';

interface SearchHistoryItem {
  city: string;
  timestamp: string;
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = useCallback((city: string) => {
    const newHistory = [
      { city, timestamp: new Date().toISOString() },
      ...history,
    ].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}; 