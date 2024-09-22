'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { useNotification } from './NotificationContext';
import { format } from 'date-fns';
import SelectableTags from './SelectableTags';
import { useRouter } from 'next/navigation';

function PropertyForm({ onPropertyAdded }) {
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();
    const [address, setAddress] = useState('');
    const [size, setSize] = useState('');
    const [area, setArea] = useState('');
    const [egenskaper, setEgenskaper] = useState([]);
    const [rent, setRent] = useState('');
    const [availableFrom, setAvailableFrom] = useState('');
    const [propertyOwner, setPropertyOwner] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [featuresOptions, setFeaturesOptions] = useState([]);
    const [areasOptions, setAreasOptions] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tags');
                const data = await response.json();
                const egenskaper = data.filter(tag => tag.type === 'egenskap');
                const areas = data.filter(tag => tag.type === 'area');
                setFeaturesOptions(egenskaper);
                setAreasOptions(areas);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleAreaChange = (e) => {
        setArea(capitalizeFirstLetter(e.target.value));
    };

    const handleEgenskaperTags = (newTags) => {
        if (newTags.length === 0) return;
        const formattedTag = capitalizeFirstLetter(newTags[newTags.length - 1]);
        if (!egenskaper.some(egenskap => egenskap.toLowerCase() === formattedTag.toLowerCase())) {
            setEgenskaper([...egenskaper, formattedTag]);
        } else {
            showNotification('Denna egenskap finns redan i listan', 'info');
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            const formattedDate = availableFrom ? format(new Date(availableFrom), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null;
            
            const propertyData = {
                address,
                size: size ? parseInt(size) : null,
                area,
                egenskaper,
                rent: rent ? parseInt(rent) : null,
                availableFrom: formattedDate,
                propertyOwner
            };

            console.log('Sending property data:', propertyData);

            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            const data = await response.json();
            console.log('Property created:', data);
            showNotification(`Lokal på "${data.address}" har lagts till`);
            
            // Reset all form fields
            setAddress('');
            setSize('');
            setArea('');
            setEgenskaper([]);
            setRent('');
            setAvailableFrom('');
            setPropertyOwner('');

            if (onPropertyAdded) {
                onPropertyAdded(data);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Ett fel uppstod: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card property-form">
            <h2>Lägg till lokal</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group custom-form-group">
                    <label htmlFor="address" className="custom-label">Adress</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
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
                        required
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="area" className="custom-label">Område</label>
                    <SelectableTags
                        options={areasOptions}
                        selectedTags={[area]}
                        setSelectedTags={(tags) => setArea(tags[0])}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="egenskaper">Egenskaper</label>
                    <SelectableTags
                        options={featuresOptions}
                        selectedTags={egenskaper}
                        setSelectedTags={setEgenskaper}
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="rent" className="custom-label">Hyra (kr/kvm/år)</label>
                    <input
                        id="rent"
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        required
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="availableFrom" className="custom-label">Tillgänglig från</label>
                    <input
                        id="availableFrom"
                        type="date"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        required
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="propertyOwner" className="custom-label">Fastighetsägare</label>
                    <input
                        id="propertyOwner"
                        type="text"
                        value={propertyOwner}
                        onChange={(e) => setPropertyOwner(e.target.value)}
                        required
                        className="custom-input"
                    />
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
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
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.6 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isSubmitting ? 'Lägger till...' : 'Lägg till lokal'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PropertyForm;
