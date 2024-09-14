'use client';

import React, { useState, useCallback } from 'react';
import CompanyList from '../components/CompanyList';
import CompanyForm from '../components/CompanyForm';
import PropertyForm from '../components/PropertyForm';
import { NotificationProvider, useNotification } from '../components/NotificationContext';
import { ConfirmationProvider } from '../components/ConfirmationContext';
import Notification from '../components/Notification';
import Logo from '../components/Logo';
import PropertyList from '../components/PropertyList';

function HomeContent() {
  const [companyListKey, setCompanyListKey] = useState(0);
  const [propertyListKey, setPropertyListKey] = useState(0);
  const { showNotification } = useNotification();

  const refreshCompanyList = useCallback(() => {
    setCompanyListKey(prevKey => prevKey + 1);
  }, []);

  const refreshPropertyList = useCallback(() => {
    setPropertyListKey(prevKey => prevKey + 1);
  }, []);

  const handleCompanyAdded = () => {
    refreshCompanyList();
  };

  const handlePropertyAdded = () => {
    refreshPropertyList();
  };

  const handleGenerateData = async () => {
    try {
      const response = await fetch('/api/generate-data', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate data');
      }
      const data = await response.json();
      refreshCompanyList();
      refreshPropertyList();
      showNotification('Data har genererats och listorna har uppdaterats', 'success');
    } catch (error) {
      console.error('Error generating data:', error);
      showNotification(`Ett fel uppstod vid generering av data: ${error.message}`, 'error');
    }
  };

  return (
    <main className="container">
      <Logo />
      <button onClick={handleGenerateData} className="generate-data-btn">
        Generera slumpmässig data
      </button>
      <div className="forms-container">
        <div className="form-column">
          <CompanyForm onCompanyAdded={handleCompanyAdded} />
        </div>
        <div className="form-column">
          <PropertyForm onPropertyAdded={handlePropertyAdded} />
        </div>
      </div>
      <div className="lists-container">
        <CompanyList key={`company-list-${companyListKey}`} />
        <PropertyList key={`property-list-${propertyListKey}`} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <NotificationProvider>
      <ConfirmationProvider>
        <HomeContent />
        <Notification />
      </ConfirmationProvider>
    </NotificationProvider>
  );
}
