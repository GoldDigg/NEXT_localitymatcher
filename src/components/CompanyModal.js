'use client';

import React, { useState, useEffect } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { useNotification } from './NotificationContext';
import styles from './CompanyModal.module.css';

function CompanyModal({ company, onClose, onCompanyUpdated }) {
    const [editedCompany, setEditedCompany] = useState(company);
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        setEditedCompany({
            ...company,
            features: Array.isArray(company.features) ? company.features : [],
            desiredAreas: Array.isArray(company.desiredAreas) ? company.desiredAreas : [],
            desiredFeatures: Array.isArray(company.desiredFeatures) ? company.desiredFeatures : [],
        });
    }, [company]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCompany(prev => ({ ...prev, [name]: value }));
    };

    const handleTagInputChange = (e) => {
        setNewTag(e.target.value);
    };

    const handleTagInputKeyDown = (field) => (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            setEditedCompany(prev => ({
                ...prev,
                [field]: [...prev[field], newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleDeleteTag = (field, index) => {
        setEditedCompany(prev => {
            const updatedCompany = {
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            };
            console.log(`Deleted tag from ${field}:`, updatedCompany);
            return updatedCompany;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...editedCompany,
                features: editedCompany.features || [],
                desiredAreas: editedCompany.desiredAreas || [],
                desiredFeatures: editedCompany.desiredFeatures || [],
                size: editedCompany.size ? parseFloat(editedCompany.size) : null,
                rent: editedCompany.rent ? parseFloat(editedCompany.rent) : null,
                desiredSizeMin: editedCompany.desiredSizeMin ? parseFloat(editedCompany.desiredSizeMin) : null,
                desiredSizeMax: editedCompany.desiredSizeMax ? parseFloat(editedCompany.desiredSizeMax) : null,
                desiredMaxRent: editedCompany.desiredMaxRent ? parseFloat(editedCompany.desiredMaxRent) : null,
                contractEndDate: editedCompany.contractEndDate ? new Date(editedCompany.contractEndDate).toISOString() : null,
            };
            console.log('Sending data:', JSON.stringify(dataToSend));
            const response = await fetch(`/api/companies/${company.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const updatedCompany = await response.json();
            console.log('Received updated company from server:', updatedCompany);
            
            onCompanyUpdated(updatedCompany);
            showNotification('Företaget har uppdaterats');
            onClose();
        } catch (error) {
            console.error('Error updating company:', error);
            showNotification(`Ett fel uppstod vid uppdatering av företaget: ${error.message}`);
        }
    };

    const handleDelete = () => {
        showConfirmation(
            `Är du säker på att du vill radera ${company.name}?`,
            async () => {
                try {
                    const response = await fetch(`/api/companies/${company.id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log('Company deleted successfully:', data);
                    onCompanyUpdated(null); // Detta kommer att trigga omatchning
                    showNotification('Företaget har raderats');
                    onClose();
                } catch (error) {
                    console.error('Error deleting company:', error);
                    showNotification(`Ett fel uppstod vid radering av företaget: ${error.message}`, 'error');
                }
            }
        );
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            // Lägg till en bekräftelsedialog här om du vill
            if (window.confirm('Är du säker på att du vill stänga utan att spara?')) {
                onClose();
            }
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Förhindra standardbeteendet för Enter
        }
    };

    useEffect(() => {
        console.log('editedCompany updated:', editedCompany);
    }, [editedCompany]);

    return (
        <div className={styles.modalOverlay} onClick={handleOutsideClick}>
            <div className={`${styles.modalContent} card`}>
                <h2>Redigera företag</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Företagsnamn</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={editedCompany.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="orgNumber">Org nummer</label>
                        <input
                            id="orgNumber"
                            name="orgNumber"
                            type="text"
                            value={editedCompany.orgNumber}
                            readOnly
                            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="streetAddress">Gatuadress</label>
                        <input
                            id="streetAddress"
                            name="streetAddress"
                            type="text"
                            value={editedCompany.streetAddress}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="area">Område</label>
                        <input
                            id="area"
                            name="area"
                            type="text"
                            value={editedCompany.area}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="size">Storlek (kvm)</label>
                        <input
                            id="size"
                            name="size"
                            type="number"
                            value={editedCompany.size || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="rent">Hyra (kr/kvm/år)</label>
                        <input
                            id="rent"
                            name="rent"
                            type="number"
                            value={editedCompany.rent || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="features">Features</label>
                        <div className={styles.tagContainer}>
                            {editedCompany.features.map((feature, index) => (
                                <span key={index} className={styles.tag}>
                                    {feature}
                                    <button 
                                        type="button" 
                                        onClick={() => handleDeleteTag('features', index)}
                                        className={styles.deleteTag}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newTag}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagInputKeyDown('features')}
                            placeholder="Skriv en feature och tryck Enter"
                            className={styles.tagInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="contractEndDate">Avtalstid t.o.m.</label>
                        <input
                            id="contractEndDate"
                            name="contractEndDate"
                            type="date"
                            value={editedCompany.contractEndDate ? new Date(editedCompany.contractEndDate).toISOString().split('T')[0] : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="desiredAreas">Önskade områden</label>
                        <div className={styles.tagContainer}>
                            {editedCompany.desiredAreas.map((area, index) => (
                                <span key={index} className={styles.tag}>
                                    {area}
                                    <button 
                                        type="button" 
                                        onClick={() => handleDeleteTag('desiredAreas', index)}
                                        className={styles.deleteTag}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newTag}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagInputKeyDown('desiredAreas')}
                            placeholder="Skriv ett område och tryck Enter"
                            className={styles.tagInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Önskad storlek (kvm)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="number"
                                name="desiredSizeMin"
                                value={editedCompany.desiredSizeMin || ''}
                                onChange={handleInputChange}
                                placeholder="Min"
                                style={{ width: '45%' }}
                            />
                            <span style={{ fontSize: '14px' }}>-</span>
                            <input
                                type="number"
                                name="desiredSizeMax"
                                value={editedCompany.desiredSizeMax || ''}
                                onChange={handleInputChange}
                                placeholder="Max"
                                style={{ width: '45%' }}
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="desiredMaxRent">Önskad maxhyra (kr/kvm/år)</label>
                        <input
                            id="desiredMaxRent"
                            name="desiredMaxRent"
                            type="number"
                            value={editedCompany.desiredMaxRent || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="desiredFeatures">Önskade features</label>
                        <div className={styles.tagContainer}>
                            {editedCompany.desiredFeatures.map((feature, index) => (
                                <span key={index} className={styles.tag}>
                                    {feature}
                                    <button 
                                        type="button" 
                                        onClick={() => handleDeleteTag('desiredFeatures', index)}
                                        className={styles.deleteTag}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newTag}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagInputKeyDown('desiredFeatures')}
                            placeholder="Skriv en önskad feature och tryck Enter"
                            className={styles.tagInput}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button 
                            type="submit" 
                            className={`btn ${styles.saveBtn}`}
                            onClick={handleSubmit}
                        >
                            Spara ändringar
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${styles.deleteBtn}`}
                            onClick={handleDelete}
                        >
                            Radera Företag
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${styles.cancelBtn}`}
                            onClick={onClose}
                        >
                            Avbryt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompanyModal;
