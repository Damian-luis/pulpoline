import React, { useState, useRef, useEffect } from 'react';
import { CitySuggestion } from '../types/weather';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useI18n } from '../hooks/useI18n';

interface SearchInputProps {
  onSearch: (city: string) => void;
  onSuggestionsChange: (query: string) => void;
  suggestions: CitySuggestion[];
  loading?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onSuggestionsChange,
  suggestions,
  loading = false,
}) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSuggestionsChange(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t('search_placeholder')}
            className="w-full px-4 py-3 pl-12 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          {loading && (
            <div className="absolute right-4 top-3.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{suggestion.name}</p>
                  <p className="text-sm text-gray-500">
                    {suggestion.region}, {suggestion.country}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 