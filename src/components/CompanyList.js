'use client';

import React, { useState, useEffect } from 'react';
import CompanyModal from './CompanyModal';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('/api/companies');
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []); // Tom dependency array betyder att detta körs endast en gång vid mount

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
    };

    const handleCompanyUpdated = (updatedCompany) => {
        if (updatedCompany === null) {
            // Företaget har raderats
            setCompanies(companies.filter(c => c.id !== selectedCompany.id));
        } else {
            // Företaget har uppdaterats
            setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
        }
        setSelectedCompany(null);
    };

    return (
        <div className="company-list">
            <h2>Företag</h2>
            {companies.map((company) => (
                <div key={`company-${company.id}`} className="company-item" onClick={() => handleCompanyClick(company)}>
                    {company.name}
                </div>
            ))}
            {selectedCompany && (
                <CompanyModal
                    company={selectedCompany}
                    onClose={handleCloseModal}
                    onCompanyUpdated={handleCompanyUpdated}
                />
            )}
        </div>
    );
}

export default CompanyList;