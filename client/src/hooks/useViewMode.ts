import { useState, useCallback, useEffect } from 'react';

type ViewMode = 'table' | 'detailed';

export const useViewMode = () => {
  const [mode, setMode] = useState<ViewMode>('detailed');

  useEffect(() => {
    const savedMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'table' ? 'detailed' : 'table';
    setMode(newMode);
    localStorage.setItem('viewMode', newMode);
  }, [mode]);

  return {
    mode,
    toggleMode,
  };
}; 