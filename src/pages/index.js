import React, { useState } from 'react';
import CompanyList from '../components/CompanyList';
import CompanyForm from '../components/CompanyForm';
import { NotificationProvider } from '../components/NotificationContext';
import { ConfirmationProvider } from '../components/ConfirmationContext';
import Notification from '../components/Notification';
import Logo from '../components/Logo';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCompanyAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <NotificationProvider>
      <ConfirmationProvider>
        <div style={{ padding: '20px' }}>
          <header style={{ marginBottom: '40px' }}>
            <Logo />
          </header>
          <main>
            <CompanyForm onCompanyAdded={handleCompanyAdded} />
            <CompanyList key={refreshTrigger} />
          </main>
          <Notification />
        </div>
      </ConfirmationProvider>
    </NotificationProvider>
  );
}
