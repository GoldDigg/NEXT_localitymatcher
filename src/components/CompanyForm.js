'use client'; // Lägg till denna rad om det är en Client Component

import React, { useState, useCallback } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { debounce } from 'lodash';
import { useNotification } from './NotificationContext';
import { format } from 'date-fns'; // Lägg till denna import överst i filen
import TagInput from './TagInput';
import { useRouter } from 'next/navigation'; // Uppdatera från 'next/router' om du använder den

function CompanyForm({ onCompanyAdded }) {
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();
    const [name, setName] = useState('');
    const [orgNumber, setOrgNumber] = useState('');
    const [orgNumberError, setOrgNumberError] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [area, setArea] = useState('');
    const [size, setSize] = useState('');
    const [rent, setRent] = useState('');
    const [features, setFeatures] = useState([]);
    const [contractEndDate, setContractEndDate] = useState('');
    const [desiredAreas, setDesiredAreas] = useState([]);
    const [desiredSizeMin, setDesiredSizeMin] = useState('');
    const [desiredSizeMax, setDesiredSizeMax] = useState('');
    const [desiredMaxRent, setDesiredMaxRent] = useState('');
    const [desiredFeatures, setDesiredFeatures] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitCount, setFormSubmitCount] = useState(0);
    const router = useRouter();

    const validateOrgNumberFormat = (orgNumber) => {
        const regex = /^\d{6}-\d{4}$/;
        return regex.test(orgNumber);
    };

    const validateOrgNumber = async (orgNumber) => {
        console.log('Validating org number:', orgNumber);
        if (!validateOrgNumberFormat(orgNumber)) {
            console.log('Invalid format');
            return false;
        }
        try {
            const response = await fetch(`/api/check_org_number?orgNumber=${orgNumber}`);
            console.log('API response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API response data:', data);
            
            // Kontrollera om 'exists' finns i svaret och är en boolean
            if (typeof data.exists === 'boolean') {
                return !data.exists; // Returnera true om organisationsnumret INTE existerar
            } else {
                console.error('Unexpected API response format:', data);
                return false; // Anta att det är ett fel och returnera false
            }
        } catch (error) {
            console.error('Error validating org number:', error);
            return false; // Anta att det är ett fel och returnera false
        }
    };

    const debouncedValidate = useCallback(
        debounce(async (value) => {
            console.log('Validating:', value);
            if (!validateOrgNumberFormat(value)) {
                setOrgNumberError('Ogiltigt format. Använd XXXXXX-XXXX');
                return;
            }
            const isValid = await validateOrgNumber(value);
            console.log('Is valid:', isValid);
            setOrgNumberError(isValid ? '' : 'Organisationsnumret finns redan');
        }, 300),
        []
    );

    const handleOrgNumberChange = (e) => {
        const value = e.target.value;
        setOrgNumber(value);
        if (value.trim() !== '') {
            debouncedValidate(value);
        } else {
            setOrgNumberError('');
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleAreaChange = (e) => {
        setArea(capitalizeFirstLetter(e.target.value));
    };

    const handleFeaturesTags = (newTags) => {
        setFeatures(newTags.map(capitalizeFirstLetter));
    };

    const handleDesiredAreasTags = (newTags) => {
        setDesiredAreas(newTags.map(capitalizeFirstLetter));
    };

    const handleDesiredFeaturesTags = (newTags) => {
        setDesiredFeatures(newTags.map(capitalizeFirstLetter));
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Förhindra standardbeteendet för Enter
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || orgNumberError) {
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Validating org number before submission:', orgNumber);
            const isValid = await validateOrgNumber(orgNumber);
            console.log('Org number validation result:', isValid);
            if (!isValid) {
                setOrgNumberError('Organisationsnumret finns redan');
                setIsSubmitting(false);
                return;
            }

            const formattedDate = contractEndDate ? format(new Date(contractEndDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null;
            
            const companyData = {
                name,
                orgNumber,
                streetAddress,
                area,
                size: size ? parseInt(size) : null,
                rent: rent ? parseInt(rent) : null,
                features,
                contractEndDate: formattedDate,
                desiredAreas,
                desiredSizeMin: desiredSizeMin ? parseInt(desiredSizeMin) : null,
                desiredSizeMax: desiredSizeMax ? parseInt(desiredSizeMax) : null,
                desiredMaxRent: desiredMaxRent ? parseInt(desiredMaxRent) : null,
                desiredFeatures
            };

            console.log('Sending company data:', companyData);
            console.log('Features:', companyData.features);
            console.log('Desired Areas:', companyData.desiredAreas);
            console.log('Desired Features:', companyData.desiredFeatures);

            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            const data = await response.json();
            console.log('Company created:', data);
            showNotification(`"${data.name}" har lagts till`);
            
            // Reset all form fields
            setName('');
            setOrgNumber('');
            setOrgNumberError('');
            setStreetAddress('');
            setArea('');
            setSize('');
            setRent('');
            setFeatures([]); // Reset features array
            setContractEndDate('');
            setDesiredAreas([]); // Reset desiredAreas array
            setDesiredSizeMin('');
            setDesiredSizeMax('');
            setDesiredMaxRent('');
            setDesiredFeatures([]); // Reset desiredFeatures array
            setFormSubmitCount(prev => prev + 1);

            if (onCompanyAdded) {
                onCompanyAdded(data);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Ett fel uppstod: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card company-form">
            <h2>Lägg till företag</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group custom-form-group">
                    <label htmlFor="name" className="custom-label">Företagsnamn</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="custom-input"
                        key={`name-${isSubmitting}`}
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="orgNumber" className="custom-label">Org nummer (XXXXXX-XXXX)</label>
                    <input
                        id="orgNumber"
                        type="text"
                        value={orgNumber}
                        onChange={handleOrgNumberChange}
                        required
                        className={`custom-input ${orgNumberError ? 'error' : ''}`}
                        placeholder="XXXXXX-XXXX"
                        pattern="\d{6}-\d{4}"
                        title="Ange organisationsnummer i formatet XXXXXX-XXXX"
                    />
                    {orgNumberError && <div className="error-message">{orgNumberError}</div>}
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="streetAddress" className="custom-label">Gatuadress</label>
                    <input
                        id="streetAddress"
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="area" className="custom-label">Område</label>
                    <input
                        id="area"
                        type="text"
                        value={area}
                        onChange={handleAreaChange}
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="size" className="custom-label">Storlek (kvm)</label>
                    <input
                        id="size"
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="rent" className="custom-label">Hyra (kr/kvm/år)</label>
                    <input
                        id="rent"
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="features">Features</label>
                    <TagInput
                        tags={features}
                        setTags={handleFeaturesTags}
                        placeholder="Skriv en feature och tryck Enter"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="contractEndDate" className="custom-label">Avtalstid t.o.m.</label>
                    <input
                        id="contractEndDate"
                        type="date"
                        value={contractEndDate}
                        onChange={(e) => setContractEndDate(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="desiredAreas">Önskade områden</label>
                    <TagInput
                        tags={desiredAreas}
                        setTags={handleDesiredAreasTags}
                        placeholder="Skriv ett område och tryck Enter"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label className="custom-label">Önskad storlek (kvm)</label>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <input
                            type="number"
                            value={desiredSizeMin}
                            onChange={(e) => setDesiredSizeMin(e.target.value)}
                            className="custom-input"
                            placeholder="Min"
                            style={{ flex: 1 }}
                        />
                        <span style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold' 
                        }}>-</span>
                        <input
                            type="number"
                            value={desiredSizeMax}
                            onChange={(e) => setDesiredSizeMax(e.target.value)}
                            className="custom-input"
                            placeholder="Max"
                            style={{ flex: 1 }}
                        />
                    </div>
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="desiredMaxRent" className="custom-label">Önskad maxhyra (kr/kvm/år)</label>
                    <input
                        id="desiredMaxRent"
                        type="number"
                        value={desiredMaxRent}
                        onChange={(e) => setDesiredMaxRent(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="desiredFeatures">Önskade features</label>
                    <TagInput
                        tags={desiredFeatures}
                        setTags={handleDesiredFeaturesTags}
                        placeholder="Skriv en önskad feature och tryck Enter"
                    />
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !!orgNumberError}
                        style={{
                            padding: '8px 16px',
                            width: '140px',
                            fontSize: '14px',
                            fontWeight: 'normal',
                            textAlign: 'center',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: '1px solid #4CAF50',
                            borderRadius: '4px',
                            cursor: isSubmitting || !!orgNumberError ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting || !!orgNumberError ? 0.6 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isSubmitting ? 'Lägger till...' : 'Lägg till företag'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CompanyForm;
