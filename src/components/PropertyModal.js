'use client';

import React, { useState, useEffect } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { useNotification } from './NotificationContext';
import styles from './PropertyModal.module.css';
import SelectableTags from './SelectableTags';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function PropertyModal({ property, onClose, onPropertyUpdated }) {
    const [editedProperty, setEditedProperty] = useState(property);
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();
    const [newTag, setNewTag] = useState('');
    const [featuresOptions, setFeaturesOptions] = useState([]);
    const [areasOptions, setAreasOptions] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tags');
                const data = await response.json();
                const features = data.filter(tag => tag.type === 'feature').map(tag => tag.name);
                const areas = data.filter(tag => tag.type === 'area').map(tag => tag.name);
                setFeaturesOptions(features);
                setAreasOptions(areas);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        console.log('Setting editedProperty:', property);
        setEditedProperty({
            ...property,
            features: Array.isArray(property.features) ? [...property.features] : [],
        });
    }, [property]);

    useEffect(() => {
        console.log('Property in modal:', property);
    }, [property]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'area') {
            setEditedProperty(prev => ({ ...prev, [name]: capitalizeFirstLetter(value) }));
        } else {
            setEditedProperty(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTagInputChange = (e) => {
        setNewTag(e.target.value);
    };

    const handleTagInputKeyDown = (field) => (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            const formattedTag = capitalizeFirstLetter(newTag.trim());
            if (!editedProperty[field].includes(formattedTag)) {
                setEditedProperty(prev => ({
                    ...prev,
                    [field]: [...prev[field], formattedTag]
                }));
                setNewTag('');
            } else {
                showNotification('Denna feature finns redan i listan', 'info');
            }
        }
    };

    const handleDeleteTag = (field, index) => {
        setEditedProperty(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...editedProperty,
                features: editedProperty.features, // Explicit skicka med features
                size: parseFloat(editedProperty.size),
                rent: parseFloat(editedProperty.rent),
                availableFrom: editedProperty.availableFrom ? new Date(editedProperty.availableFrom).toISOString() : null,
            };
            const response = await fetch(`/api/properties/${property.id}`, {
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

            const updatedProperty = await response.json();
            onPropertyUpdated(updatedProperty);
            showNotification('Lokalen har uppdaterats', 'success');
            onClose();
        } catch (error) {
            console.error('Error updating property:', error);
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
                        throw new Error(`Failed to delete property: ${errorData.message}`);
                    }
                    
                    onPropertyUpdated(null); // Skicka null för att indikera radering
                    showNotification('Lokalen har raderats', 'success');
                    onClose();
                } catch (error) {
                    console.error('Error deleting property:', error);
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
            <div className={styles.modalContent}>
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
                        <SelectableTags
                            options={areasOptions}
                            selectedTags={[editedProperty.area]}
                            setSelectedTags={(tags) => setEditedProperty({ ...editedProperty, area: tags[0] })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="features">Features</label>
                        <SelectableTags
                            options={featuresOptions}
                            selectedTags={editedProperty.features}
                            setSelectedTags={(tags) => setEditedProperty({ ...editedProperty, features: tags })}
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
                        <button type="submit" className={`btn ${styles.saveBtn}`}>
                            Spara ändringar
                        </button>
                        <button type="button" className={`btn ${styles.deleteBtn}`} onClick={handleDelete}>
                            Radera Lokal
                        </button>
                        <button type="button" className={`btn ${styles.cancelBtn}`} onClick={onClose}>
                            Avbryt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PropertyModal;
