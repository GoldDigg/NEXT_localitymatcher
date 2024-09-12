'use client';

import React, { useState, useEffect } from 'react';
import CompanyModal from './CompanyModal';
import { useNotification } from './NotificationContext';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredCompanyId, setHoveredCompanyId] = useState(null);
    const { showNotification } = useNotification();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchCompanies();
    }, [refreshTrigger]);

    useEffect(() => {
        console.log('selectedCompany updated:', selectedCompany);
    }, [selectedCompany]);

    useEffect(() => {
        console.log('selectedCompany changed:', selectedCompany);
    }, [selectedCompany]);

    useEffect(() => {
        console.log('Rendering CompanyModal:', !!selectedCompany);
    }, [selectedCompany]);

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

    const handleCompanyClick = async (companyId) => {
        console.log('Company clicked:', companyId);
        try {
            const response = await fetch(`/api/companies/${companyId}`);
            console.log('API response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched company data:', data);
            setSelectedCompany(data);
        } catch (error) {
            console.error('Error fetching company:', error);
            showNotification(`Ett fel uppstod vid hämtning av företaget: ${error.message}`, 'error');
        }
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
        setIsModalOpen(false);
        triggerRefresh();
    };

    const getCompanyStyle = (companyId) => ({
        cursor: 'pointer',
        padding: '8px',
        backgroundColor: hoveredCompanyId === companyId ? '#f0f0f0' : 'transparent',
        color: hoveredCompanyId === companyId ? '#333' : 'inherit',
        transition: 'background-color 0.3s ease, color 0.3s ease',
    });

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCompanyAdded = () => {
        triggerRefresh();
        showNotification('Företaget har lagts till', 'success');
    };

    const handleCompanyUpdated = (updatedCompany) => {
        if (updatedCompany === null) {
            // Företaget har raderats
            setCompanies(prevCompanies => 
                prevCompanies.filter(company => company.id !== selectedCompany.id)
            );
        } else if (updatedCompany) {
            // Företaget har uppdaterats
            setCompanies(prevCompanies => 
                prevCompanies.map(company => 
                    company.id === updatedCompany.id ? updatedCompany : company
                )
            );
        }
        setSelectedCompany(null);
    };

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
                        onClick={() => handleCompanyClick(company.id)}
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
                    onClose={() => {
                        console.log('Closing modal');
                        setSelectedCompany(null);
                    }} 
                    onCompanyUpdated={handleCompanyUpdated} 
                />
            )}
        </div>
    );
}

export default CompanyList;