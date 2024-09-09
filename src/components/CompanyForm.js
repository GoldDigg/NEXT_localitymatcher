import React, { useState, useCallback } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { debounce } from 'lodash';
import { useNotification } from './NotificationContext';

// Lägg till denna enkla Chip-komponent
const Chip = ({ label, onDelete }) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 8px',
    margin: '2px',
    backgroundColor: '#e0e0e0',
    borderRadius: '16px',
    fontSize: '14px'
  }}>
    {label}
    <button onClick={onDelete} style={{
      marginLeft: '4px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    }}>
      ×
    </button>
  </span>
);

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

    const validateOrgNumber = async (orgNumber) => {
        console.log('Validating org number:', orgNumber);
        try {
            const response = await fetch(`/api/check_org_number/${orgNumber}`);
            console.log('API response status:', response.status);
            const data = await response.json();
            console.log('API response data:', data);
            return !data.exists;
        } catch (error) {
            console.error('Error validating org number:', error);
            return false;
        }
    };

    const debouncedValidate = useCallback(
        debounce(async (value) => {
            const isValid = await validateOrgNumber(value);
            setOrgNumberError(isValid ? '' : 'Organisationsnumret finns redan');
        }, 300),
        []
    );

    const handleCommaSeperatedInput = (setValue) => (e) => {
        const value = e.target.value;
        setValue(value ? value.split(',').map(item => item.trim()).filter(item => item !== '') : []);
    };

    const handleOrgNumberChange = (e) => {
        const value = e.target.value;
        setOrgNumber(value);
        debouncedValidate(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || orgNumberError) {
            return;
        }
        setIsSubmitting(true);
        try {
            const isValid = await validateOrgNumber(orgNumber);
            if (!isValid) {
                setOrgNumberError('Organisationsnumret finns redan');
                return;
            }

            const companyData = {
                name,
                orgNumber,
                streetAddress,
                area,
                size: size ? parseFloat(size) : null,
                rent: rent ? parseFloat(rent) : null,
                features,
                contractEndDate: contractEndDate || null,
                desiredAreas,
                desiredSizeMin: desiredSizeMin ? parseFloat(desiredSizeMin) : null,
                desiredSizeMax: desiredSizeMax ? parseFloat(desiredSizeMax) : null,
                desiredMaxRent: desiredMaxRent ? parseFloat(desiredMaxRent) : null,
                desiredFeatures
            };

            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ett okänt fel uppstod');
            }
            const data = await response.json();
            console.log('Success:', data);
            showNotification(`"${name}" är nu tillagd`);
            
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

            await onCompanyAdded();
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Ett fel uppstod när "${name}" skulle läggas till: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleArrayInput = (setValue) => (event) => {
        if (event.key === 'Enter' && event.target.value.trim()) {
            setValue(prev => [...prev, event.target.value.trim()]);
            event.target.value = '';
        }
    };

    const handleDeleteChip = (setValue, index) => () => {
        setValue(prev => prev.filter((_, i) => i !== index));
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
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="area" className="custom-label">Område</label>
                    <input
                        id="area"
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
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
                <div className="form-group custom-form-group">
                    <label htmlFor="features" className="custom-label">Features (kommaseparerad lista)</label>
                    <input
                        id="features"
                        type="text"
                        onKeyDown={handleArrayInput(setFeatures)}
                        className="custom-input"
                        placeholder="Skriv och tryck Enter för att lägga till"
                        key={`features-${formSubmitCount}`}
                    />
                    <div>
                        {features.map((feature, index) => (
                            <Chip
                                key={index}
                                label={feature}
                                onDelete={handleDeleteChip(setFeatures, index)}
                            />
                        ))}
                    </div>
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
                <div className="form-group custom-form-group">
                    <label htmlFor="desiredAreas" className="custom-label">Önskat område (Kommaseparerad lista)</label>
                    <input
                        id="desiredAreas"
                        type="text"
                        onKeyDown={handleArrayInput(setDesiredAreas)}
                        className="custom-input"
                        placeholder="Skriv och tryck Enter för att lägga till"
                        key={`desiredAreas-${formSubmitCount}`}
                    />
                    <div>
                        {desiredAreas.map((area, index) => (
                            <Chip
                                key={index}
                                label={area}
                                onDelete={handleDeleteChip(setDesiredAreas, index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="form-group custom-form-group">
                    <label className="custom-label">Önskad storlek (kvm)</label>
                    <div className="size-range">
                        <input
                            type="number"
                            value={desiredSizeMin}
                            onChange={(e) => setDesiredSizeMin(e.target.value)}
                            className="custom-input size-input"
                            placeholder="Min"
                        />
                        <span className="size-separator">-</span>
                        <input
                            type="number"
                            value={desiredSizeMax}
                            onChange={(e) => setDesiredSizeMax(e.target.value)}
                            className="custom-input size-input"
                            placeholder="Max"
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
                <div className="form-group custom-form-group">
                    <label htmlFor="desiredFeatures" className="custom-label">Önskade features (kommaseparerad lista)</label>
                    <input
                        id="desiredFeatures"
                        type="text"
                        onKeyDown={handleArrayInput(setDesiredFeatures)}
                        className="custom-input"
                        placeholder="Skriv och tryck Enter för att lägga till"
                        key={`desiredFeatures-${formSubmitCount}`}
                    />
                    <div>
                        {desiredFeatures.map((feature, index) => (
                            <Chip
                                key={index}
                                label={feature}
                                onDelete={handleDeleteChip(setDesiredFeatures, index)}
                            />
                        ))}
                    </div>
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
