import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { useNotification } from './NotificationContext';
import { debounce } from 'lodash';
import './CompanyModal.css'; // Lägg till denna rad om du skapar en separat CSS-fil

function CompanyModal({ company, onClose, onCompanyUpdated }) {
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();
    const [name, setName] = useState(company.name || '');
    const [orgNumber, setOrgNumber] = useState(company.orgNumber || '');
    const [streetAddress, setStreetAddress] = useState(company.streetAddress || '');
    const [area, setArea] = useState(company.area || '');
    const [size, setSize] = useState(company.size || '');
    const [rent, setRent] = useState(company.rent || '');
    const [features, setFeatures] = useState(company.features || []);
    const [contractEndDate, setContractEndDate] = useState(company.contractEndDate || '');
    const [desiredAreas, setDesiredAreas] = useState(company.desiredAreas || []);
    const [desiredSizeMin, setDesiredSizeMin] = useState(company.desiredSizeMin || '');
    const [desiredSizeMax, setDesiredSizeMax] = useState(company.desiredSizeMax || '');
    const [desiredMaxRent, setDesiredMaxRent] = useState(company.desiredMaxRent || '');
    const [desiredFeatures, setDesiredFeatures] = useState(company.desiredFeatures || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);
    const [modalHeight, setModalHeight] = useState('auto');

    useEffect(() => {
        const adjustModalHeight = () => {
            if (modalRef.current) {
                const windowHeight = window.innerHeight;
                const marginVertical = 80; // 80px marginal i topp och botten
                const availableHeight = windowHeight - (2 * marginVertical);
                setModalHeight(`${availableHeight}px`);
            }
        };

        adjustModalHeight();
        window.addEventListener('resize', adjustModalHeight);

        return () => {
            window.removeEventListener('resize', adjustModalHeight);
        };
    }, []);

    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleCommaSeperatedInput = (setValue) => (e) => {
        const value = e.target.value;
        setValue(value ? value.split(',').map(item => item.trim()).filter(item => item !== '') : []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            const updatedCompany = {
                name,
                orgNumber,
                streetAddress,
                area,
                size: convertEmptyToNull(size),
                rent: convertEmptyToNull(rent),
                features,
                contractEndDate,
                desiredAreas,
                desiredSizeMin: convertEmptyToNull(desiredSizeMin),
                desiredSizeMax: convertEmptyToNull(desiredSizeMax),
                desiredMaxRent: convertEmptyToNull(desiredMaxRent),
                desiredFeatures,
            };

            const response = await fetch(`/api/companies/${company.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCompany),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ett okänt fel uppstod');
            }
            const data = await response.json();
            console.log('Success:', data);
            showConfirmation(`"${name}" har uppdaterats`, null, false); // Add false to hide cancel button
            
            if (typeof onCompanyUpdated === 'function') {
                onCompanyUpdated();
            }
            if (typeof onClose === 'function') {
                onClose();
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Ett fel uppstod när "${name}" skulle uppdateras: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        showConfirmation(
            `Är du säker på att du vill radera företaget "${name}"?`,
            async () => {
                try {
                    const response = await fetch(`/api/companies/${company.id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Ett fel uppstod vid radering av företaget');
                    }
                    showNotification(`Företaget "${name}" har raderats`);
                    if (typeof onCompanyUpdated === 'function') {
                        onCompanyUpdated();
                    }
                    if (typeof onClose === 'function') {
                        onClose();
                    }
                } catch (error) {
                    console.error('Error deleting company:', error);
                    showNotification(`Ett fel uppstod när "${name}" skulle raderas: ${error.message}`);
                }
            },
            true // Show both "Ja" and "Nej" buttons
        );
    };

    const convertEmptyToNull = (value) => value === '' ? null : value;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div 
                    ref={modalRef} 
                    className="card company-form" 
                    style={{ maxHeight: modalHeight, overflowY: 'auto' }}
                >
                    <h2>Redigera företag</h2>
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
                            />
                        </div>
                        <div className="form-group custom-form-group">
                            <label htmlFor="orgNumber" className="custom-label">Organisationsnummer</label>
                            <input
                                id="orgNumber"
                                type="text"
                                value={orgNumber}
                                className="custom-input disabled-input"
                                disabled
                            />
                            <small className="info-text">Organisationsnummer kan inte ändras efter att företaget har skapats.</small>
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
                                min="0"
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
                                value={(features && Array.isArray(features)) ? features.join(', ') : ''}
                                onChange={handleCommaSeperatedInput(setFeatures)}
                                className="custom-input"
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
                        <div className="form-group custom-form-group">
                            <label htmlFor="desiredAreas" className="custom-label">Önskat område (Kommaseparerad lista)</label>
                            <input
                                id="desiredAreas"
                                type="text"
                                value={(desiredAreas && Array.isArray(desiredAreas)) ? desiredAreas.join(', ') : ''}
                                onChange={handleCommaSeperatedInput(setDesiredAreas)}
                                className="custom-input"
                            />
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
                                value={(desiredFeatures && Array.isArray(desiredFeatures)) ? desiredFeatures.join(', ') : ''}
                                onChange={handleCommaSeperatedInput(setDesiredFeatures)}
                                className="custom-input"
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px',
                            marginTop: '20px'
                        }}>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
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
                                    cursor: 'pointer',
                                    opacity: isSubmitting ? 0.5 : 1
                                }}
                            >
                                {isSubmitting ? 'Uppdaterar...' : 'Uppdatera företag'}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                style={{
                                    padding: '8px 16px',
                                    width: '140px',
                                    fontSize: '14px',
                                    fontWeight: 'normal',
                                    textAlign: 'center',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: '1px solid #f44336',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Radera företag
                            </button>
                            <button 
                                type="button" 
                                onClick={onClose}
                                style={{
                                    padding: '8px 16px',
                                    width: '140px',
                                    fontSize: '14px',
                                    fontWeight: 'normal',
                                    textAlign: 'center',
                                    backgroundColor: '#f1f1f1',
                                    color: '#333',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Avbryt
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CompanyModal;
