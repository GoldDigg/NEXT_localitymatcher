import React, { useState, useEffect } from 'react';
import CompanyModal from './CompanyModal.js';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [hoveredCompanyId, setHoveredCompanyId] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('/api/companies');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error('Received data is not an array:', data);
                setCompanies([]);
                return;
            }
            sortCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setCompanies([]);
        }
    };

    const sortCompanies = (data) => {
        const sortedCompanies = data.sort((a, b) => 
            sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
        setCompanies([...sortedCompanies]);
    };

    const toggleSort = () => {
        setSortAscending(!sortAscending);
        sortCompanies(companies);
    };

    const handleCompanyClick = async (company) => {
        try {
            const response = await fetch(`/api/companies/${company.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fullCompanyData = await response.json();
            setSelectedCompany(fullCompanyData);
        } catch (error) {
            console.error('Error fetching company details:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
        fetchCompanies(); // Refresh the list after editing or deleting
    };

    const getCompanyStyle = (companyId) => ({
        cursor: 'pointer',
        padding: '8px',
        backgroundColor: hoveredCompanyId === companyId ? '#f0f0f0' : 'transparent',
        color: hoveredCompanyId === companyId ? '#333' : 'inherit',
        transition: 'background-color 0.3s ease, color 0.3s ease',
    });

    return (
        <div>
            <h2>Företagslista</h2>
            <button onClick={toggleSort}>
                Sortera {sortAscending ? 'Fallande' : 'Stigande'}
            </button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {companies.map(company => (
                    <li 
                        key={company.id} 
                        onClick={() => handleCompanyClick(company)}
                        onMouseEnter={() => setHoveredCompanyId(company.id)}
                        onMouseLeave={() => setHoveredCompanyId(null)}
                        style={getCompanyStyle(company.id)}
                    >
                        {company.name}
                    </li>
                ))}
            </ul>
            {selectedCompany && (
                <CompanyModal 
                    company={selectedCompany} 
                    onClose={() => setSelectedCompany(null)} 
                    onCompanyUpdated={fetchCompanies} // eller någon annan funktion som uppdaterar listan
                />
            )}
        </div>
    );
}

export default CompanyList;