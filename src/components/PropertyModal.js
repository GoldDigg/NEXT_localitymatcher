'use client';

import React, { useState, useEffect } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { useNotification } from './NotificationContext';
import styles from './PropertyModal.module.css';

function PropertyModal({ property, onClose, onPropertyUpdated }) {
    const [editedProperty, setEditedProperty] = useState(property);
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();

    useEffect(() => {
        setEditedProperty(property);
    }, [property]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProperty(prev => ({
            ...prev,
            [name]: name === 'size' || name === 'rent' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending update request for property:', editedProperty);
            const response = await fetch(`/api/properties/${property.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProperty),
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(`Failed to update property: ${responseData.message || response.statusText}`);
            }
            
            console.log('Updated property:', responseData);
            onPropertyUpdated(responseData);
            showNotification('Fastigheten har uppdaterats', 'success');
            onClose();
        } catch (error) {
            console.error('Error updating property:', error);
            showNotification(`Ett fel uppstod vid uppdatering av fastigheten: ${error.message}`, 'error');
        }
    };

    const handleDelete = () => {
        showConfirmation(
            'Är du säker på att du vill radera denna fastighet?',
            async () => {
                try {
                    const response = await fetch(`/api/properties/${property.id}`, {
                        method: 'DELETE',
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to delete property: ${errorData.message}`);
                    }
                    
                    onPropertyUpdated(null);
                    showNotification('Fastigheten har raderats', 'success');
                    onClose();
                } catch (error) {
                    console.error('Error deleting property:', error);
                    showNotification(`Ett fel uppstod vid radering av fastigheten: ${error.message}`, 'error');
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
            <div className={`${styles.modalContent} card`}>
                <h2>Redigera fastighet</h2>
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
                        <label htmlFor="rent">Hyra (kr/kvm/år)</label>
                        <input
                            id="rent"
                            name="rent"
                            type="number"
                            value={editedProperty.rent}
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
                            Radera fastighet
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
