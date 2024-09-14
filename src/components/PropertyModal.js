'use client';

import React, { useState, useEffect } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { useNotification } from './NotificationContext';
import TagInput from './TagInput';
import styles from './PropertyModal.module.css';

function PropertyModal({ property, onClose, onPropertyUpdated }) {
    const [editedProperty, setEditedProperty] = useState(property);
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();

    useEffect(() => {
        setEditedProperty(property);
        // Förhindra scrollning av bakgrunden när modalen öppnas
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        return () => {
            // Återställ scrollning när komponenten unmountas
            document.body.style.overflow = 'unset';
            document.body.classList.remove('modal-open');
        };
    }, [property]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProperty(prev => ({
            ...prev,
            [name]: name === 'size' || name === 'rent' ? parseFloat(value) : value
        }));
    };

    const handleFeaturesTags = (newTags) => {
        setEditedProperty(prev => ({ ...prev, features: newTags }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending update request for local:', editedProperty);
            const response = await fetch(`/api/properties/${property.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProperty),
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(`Failed to update local: ${responseData.message || response.statusText}`);
            }
            
            console.log('Updated local:', responseData);
            onPropertyUpdated(responseData);
            showNotification('Lokalen har uppdaterats', 'success');
            onClose();
        } catch (error) {
            console.error('Error updating local:', error);
            showNotification(`Ett fel uppstod vid uppdatering av lokalen: ${error.message}`, 'error');
        }
    };

    const handleDelete = () => {
        showConfirmation(
            'Är du säker på att du vill radera denna lokal?',
            async () => {
                try {
                    const response = await fetch(`/api/properties/${property.id}`, {
                        method: 'DELETE',
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to delete local: ${errorData.message}`);
                    }
                    
                    onPropertyUpdated(null);
                    showNotification('Lokalen har raderats', 'success');
                    onClose();
                } catch (error) {
                    console.error('Error deleting local:', error);
                    showNotification(`Ett fel uppstod vid radering av lokalen: ${error.message}`, 'error');
                }
            }
        );
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOutsideClick}>
            <div className={`${styles.modalContent} card`} onClick={(e) => e.stopPropagation()}>
                <h2>Redigera lokal</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="address">Adress</label>
                        <input
                            id="address"
                            name="address"
                            value={editedProperty.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="size">Storlek (kvm)</label>
                        <input
                            id="size"
                            name="size"
                            type="number"
                            value={editedProperty.size}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="area">Område</label>
                        <input
                            id="area"
                            name="area"
                            value={editedProperty.area}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="features">Features</label>
                        <TagInput
                            tags={editedProperty.features}
                            setTags={handleFeaturesTags}
                            placeholder="Skriv en feature och tryck Enter"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="rent">Hyra (kr/kvm/år)</label>
                        <input
                            id="rent"
                            name="rent"
                            type="number"
                            value={editedProperty.rent}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="availableFrom">Tillgänglig från</label>
                        <input
                            id="availableFrom"
                            name="availableFrom"
                            type="date"
                            value={editedProperty.availableFrom ? editedProperty.availableFrom.split('T')[0] : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="propertyOwner">Fastighetsägare</label>
                        <input
                            id="propertyOwner"
                            name="propertyOwner"
                            value={editedProperty.propertyOwner}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button 
                            type="submit" 
                            className={`btn ${styles.saveBtn}`}
                        >
                            Spara ändringar
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${styles.deleteBtn}`}
                            onClick={handleDelete}
                        >
                            Radera lokal
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

export default PropertyModal;
