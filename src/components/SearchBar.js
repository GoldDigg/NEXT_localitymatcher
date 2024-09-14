import React, { useState } from 'react';

const SearchBar = ({ onSearch, searchType, onSearchTypeChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={`Sök ${searchType === 'company' ? 'företag' : 'lokaler'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Sök</button>
      </form>
      <div className="search-type-toggle">
        <label>
          <input
            type="checkbox"
            checked={searchType === 'property'}
            onChange={() => onSearchTypeChange(searchType === 'company' ? 'property' : 'company')}
          />
          Sök lokaler
        </label>
      </div>
    </div>
  );
};

export default SearchBar;
