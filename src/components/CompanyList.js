'use client';

import React, { useState } from 'react';
import CompanyModal from './CompanyModal';

function CompanyList({ companies, onCompanyUpdate }) {
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
    };

    const handleCompanyUpdated = (updatedCompany) => {
        onCompanyUpdate(updatedCompany);
        setSelectedCompany(null);
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