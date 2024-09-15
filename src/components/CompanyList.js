'use client';

import React, { useState } from 'react';
import CompanyModal from './CompanyModal';

function CompanyList({ companies, onCompanyUpdate, triggerRematching }) {
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
    };

    const handleCompanyUpdated = (updatedCompany) => {
        console.log('Received updated company in CompanyList:', updatedCompany);
        if (updatedCompany) {
            onCompanyUpdate(prevCompanies => 
                prevCompanies.map(company => 
                    company.id === updatedCompany.id ? {...company, ...updatedCompany} : company
                )
            );
        } else {
            onCompanyUpdate(prevCompanies => 
                prevCompanies.filter(company => company.id !== selectedCompany.id)
            );
        }
        setSelectedCompany(null);
        triggerRematching();
    };

    return (
        <div className="list-container company-list">
            <h2>Företag</h2>
            <div className="list-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Namn</th>
                            <th>Org.nummer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={`company-${company.id}`} onClick={() => handleCompanyClick(company)}>
                                <td>{company.name}</td>
                                <td>{company.orgNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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