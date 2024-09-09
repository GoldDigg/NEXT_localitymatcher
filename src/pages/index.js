import { useState, useEffect } from 'react';
import CompanyForm from '../components/CompanyForm';
import CompanyList from '../components/CompanyList';
import { ConfirmationProvider } from '../components/ConfirmationContext';
import Confirmation from '../components/Confirmation';
import Notification from '../components/Notification';
import { NotificationProvider } from '../components/NotificationContext';

export default function Home() {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/companies');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanyAdded = async () => {
        await fetchCompanies();
    };

    return (
        <NotificationProvider>
            <ConfirmationProvider>
                <div>
                    <div className="logo">
                        <span className="locality" style={{color: 'darkblue'}}>locality</span>
                        <span className="matcher">matcher</span>
                    </div>
                    <CompanyForm onCompanyAdded={handleCompanyAdded} />
                    {isLoading ? (
                        <p>Laddar företag...</p>
                    ) : (
                        <CompanyList companies={companies} />
                    )}
                    <Confirmation />
                    <Notification />
                </div>
            </ConfirmationProvider>
        </NotificationProvider>
    );
}
