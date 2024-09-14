'use client';

import React, { useState, useEffect } from 'react';
import PropertyModal from './PropertyModal';
import { useNotification } from './NotificationContext';

function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const { showNotification } = useNotification();

    const fetchProperties = async () => {
        try {
            const response = await fetch('/api/properties');
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []); // Tom dependency array betyder att detta körs endast en gång vid mount

    const handlePropertyClick = (property) => {
        setSelectedProperty(property);
    };

    const handleCloseModal = () => {
        setSelectedProperty(null);
    };

    const handlePropertyUpdated = (updatedProperty) => {
        if (updatedProperty === null) {
            // Fastigheten har raderats
            setProperties(properties.filter(p => p.id !== selectedProperty.id));
        } else {
            // Fastigheten har uppdaterats
            setProperties(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
        }
        setSelectedProperty(null);
    };

    return (
        <div className="property-list">
            <h2>Fastigheter</h2>
            {properties.map((property) => (
                <div key={`property-${property.id}`} className="property-item" onClick={() => handlePropertyClick(property)}>
                    {property.address}
                </div>
            ))}
            {selectedProperty && (
                <PropertyModal
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                    onPropertyUpdated={handlePropertyUpdated}
                />
            )}
        </div>
    );
}

export default PropertyList;
