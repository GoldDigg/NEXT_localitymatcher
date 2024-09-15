'use client';

import { useState, useEffect, useCallback } from 'react';
import CompanyForm from '../components/CompanyForm';
import PropertyForm from '../components/PropertyForm';
import CompanyList from '../components/CompanyList';
import PropertyList from '../components/PropertyList';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { useNotification } from '../components/NotificationContext';
import { calculateMatchScore } from '../utils/matchingEngine';
import Logo from '../components/Logo';
import MatchDetailsModal from '../components/MatchDetailsModal';

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [properties, setProperties] = useState([]);
  const [matches, setMatches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('company');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { showNotification } = useNotification();

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showNotification('Fel vid hämtning av företag', 'error');
    }
  }, [showNotification]);

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      showNotification('Fel vid hämtning av lokaler', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    fetchCompanies();
    fetchProperties();
  }, [fetchCompanies, fetchProperties]);

  const handleSearch = (searchTerm) => {
    setIsSearching(true);
    const dataToSearch = searchType === 'company' ? companies : properties;
    const filtered = dataToSearch.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSearchResults(filtered);
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSearchResultClick = (item) => {
    console.log('Clicked item:', item);
  };

  const handleGenerateData = async () => {
    try {
      const response = await fetch('/api/generate-data', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate data');
      }

      const result = await response.json();
      console.log(result.message); // Logga meddelandet från servern

      // Uppdatera data
      await fetchCompanies();
      await fetchProperties();

      showNotification('Slumpmässig data har genererats', 'success');
    } catch (error) {
      console.error('Error generating random data:', error);
      showNotification('Fel vid generering av slumpmässig data', 'error');
    }
  };

  const generateMatches = () => {
    const allMatches = [];
    for (const company of companies) {
      for (const property of properties) {
        const score = calculateMatchScore(company, property);
        allMatches.push({ company, property, score });
      }
    }
    allMatches.sort((a, b) => b.score - a.score);
    setMatches(allMatches.slice(0, 50));
  };

  useEffect(() => {
    if (companies.length > 0 && properties.length > 0) {
      generateMatches();
    }
  }, [companies, properties]);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const handleCompanyUpdate = useCallback((updateFn) => {
    setCompanies(prevCompanies => {
        const updatedCompanies = updateFn(prevCompanies);
        console.log('Updated companies in main component:', updatedCompanies);
        return updatedCompanies;
    });
  }, []);

  const handlePropertyUpdate = (updatedProperty) => {
    // Implementera logik för att uppdatera fastighetslistan
    // Detta kan innebära att anropa fetchProperties igen eller uppdatera state direkt
  };

  const triggerRematching = () => {
    const newMatches = [];
    for (const company of companies) {
      for (const property of properties) {
        const score = calculateMatchScore(company, property);
        if (score > 0) {
          newMatches.push({ company, property, score });
        }
      }
    }
    setMatches(newMatches.sort((a, b) => b.score - a.score));
  };

  return (
    <div className="container">
      <Logo />
      <button onClick={handleGenerateData} className="generate-data-btn">
        Generera slumpmässig data
      </button>
      <SearchBar 
        onSearch={handleSearch} 
        searchType={searchType} 
        onSearchTypeChange={handleSearchTypeChange}
      />
      {isSearching && (
        <SearchResults 
          results={searchResults} 
          searchType={searchType} 
          onItemClick={handleSearchResultClick}
        />
      )}
      <div className="matches-list">
        <h2>Topp 50 Matchningar</h2>
        <div className="matches-table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Företag</th>
                <th>Lokal</th>
                <th>Poäng</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <tr key={index} onClick={() => handleMatchClick(match)}>
                  <td>{index + 1}</td>
                  <td>{match.company.name}</td>
                  <td>{match.property.address}</td>
                  <td>{match.score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="forms-container">
        <div className="form-column">
          <CompanyForm onCompanyAdded={fetchCompanies} />
        </div>
        <div className="form-column">
          <PropertyForm onPropertyAdded={fetchProperties} />
        </div>
      </div>
      <div className="lists-container">
        <div className="list-column">
          <CompanyList 
            companies={companies} 
            onCompanyUpdate={handleCompanyUpdate} 
            triggerRematching={triggerRematching}
          />
        </div>
        <div className="list-column">
          <PropertyList 
            properties={properties} 
            onPropertyUpdate={handlePropertyUpdate} 
            triggerRematching={triggerRematching}
          />
        </div>
      </div>
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
