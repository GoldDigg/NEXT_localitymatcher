'use client';

import React, { useState } from 'react';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';

export default function HomeContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Visa lista' : 'Lägg till företag'}
      </button>
      {showForm ? <CompanyForm /> : <CompanyList />}
    </>
  );
}
