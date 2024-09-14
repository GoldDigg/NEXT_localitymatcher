'use client';

import { useState, useEffect } from 'react';
import CompanyForm from '../components/CompanyForm';
import PropertyForm from '../components/PropertyForm';
import CompanyList from '../components/CompanyList';
import PropertyList from '../components/PropertyList';
import { useNotification } from '../components/NotificationContext';
import { calculateMatchScore } from '../utils/matchingEngine';
import Logo from '../components/Logo';  // Importera Logo komponenten

export default function Home() {
  const { showNotification } = useNotification();
  const [matches, setMatches] = useState([]);

  const handleGenerateData = async () => {
    try {
      const response = await fetch('/api/generate-data', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to generate data');
      }
      showNotification('Data har genererats', 'success');
      fetchMatches(); // Hämta matchningar efter att ny data har genererats
    } catch (error) {
      console.error('Error generating data:', error);
      showNotification('Ett fel uppstod vid generering av data', 'error');
    }
  };

  const fetchMatches = async () => {
    try {
      const [companiesResponse, propertiesResponse] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/properties')
      ]);

      if (!companiesResponse.ok || !propertiesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const companies = await companiesResponse.json();
      const properties = await propertiesResponse.json();

      const allMatches = [];
      companies.forEach(company => {
        properties.forEach(property => {
          const score = calculateMatchScore(company, property);
          allMatches.push({ company, property, score });
        });
      });

      allMatches.sort((a, b) => b.score - a.score);
      setMatches(allMatches.slice(0, 50));
    } catch (error) {
      console.error('Error fetching matches:', error);
      showNotification('Ett fel uppstod vid hämtning av matchningar', 'error');
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="container">
      <Logo />  {/* Lägg till Logo komponenten här istället för h1 */}
      <button onClick={handleGenerateData} className="generate-data-btn">
        Generera slumpmässig data
      </button>

      {/* Uppdaterad matchningslista */}
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
                <tr key={index}>
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

      <div className="forms-container" style={{ width: '100%' }}>
        <div className="form-column">
          <CompanyForm />
        </div>
        <div className="form-column">
          <PropertyForm />
        </div>
      </div>
      <div className="lists-container">
        <div className="list-column">
          <CompanyList />
        </div>
        <div className="list-column">
          <PropertyList />
        </div>
      </div>
    </div>
  );
}
