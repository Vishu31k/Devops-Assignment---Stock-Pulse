import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { searchStocks } from '../services/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      setLoading(true);
      setShowDropdown(true);
      try {
        const data = await searchStocks(value);
        // Mock fallback if API not ready
        setResults(data?.length ? data : [
          { symbol: 'AAPL', name: 'Apple Inc.' },
          { symbol: 'GOOGL', name: 'Alphabet Inc.' }
        ]);
      } catch (error) {
        console.error('Search error', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (symbol) => {
    setQuery('');
    setShowDropdown(false);
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search stocks by symbol or name..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 1 && setShowDropdown(true)}
        />
      </div>
      
      {showDropdown && (
        <div className="search-results">
          {loading ? (
            <div className="search-item loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((result, idx) => (
              <div 
                key={`${result.symbol}-${idx}`} 
                className="search-item"
                onClick={() => handleSelect(result.symbol)}
              >
                <span className="search-item-symbol">{result.symbol}</span>
                <span className="search-item-name">{result.name}</span>
              </div>
            ))
          ) : (
            <div className="search-item empty">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
