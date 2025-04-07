
import React, { useState, useEffect, useRef } from 'react';
import dictionaryService from '../services/DictionaryService';
import { Search } from 'lucide-react';

interface AutocompleteProps {
  placeholder?: string;
  maxSuggestions?: number;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  placeholder = 'Search...',
  maxSuggestions = 8,
  onChange,
  onSelect
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const results = dictionaryService.search(inputValue, maxSuggestions);
    setSuggestions(results);
    setIsOpen(results.length > 0);
  }, [inputValue, maxSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange && onChange(value);
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsOpen(false);
    onSelect && onSelect(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prevIndex => (
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      ));
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prevIndex => (
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      ));
    }
    // Enter
    else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    }
    // Escape
    else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="font-bold text-white">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div className="autocomplete-container">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="autocomplete-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          aria-label="Search"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={isOpen ? 'suggestions-list' : undefined}
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
      </div>

      {isOpen && (
        <div 
          ref={suggestionsRef}
          id="suggestions-list"
          role="listbox"
          className="autocomplete-suggestions animate-fade-in"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {highlightMatch(suggestion, inputValue)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
