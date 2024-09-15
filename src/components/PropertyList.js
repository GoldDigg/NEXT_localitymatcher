'use client';

import React, { useState, useEffect } from 'react';
import PropertyModal from './PropertyModal';
import { useNotification } from './NotificationContext';

function PropertyList({ properties, onPropertyUpdate, triggerRematching }) {
    const [selectedProperty, setSelectedProperty] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        console.log('Properties in PropertyList:', properties);
    }, [properties]);

    const handlePropertyClick = (property) => {
        setSelectedProperty(property);
    };

    const handleCloseModal = () => {
        setSelectedProperty(null);
    };

    const handlePropertyUpdated = (updatedProperty) => {
        console.log('Updating property:', updatedProperty);
        if (updatedProperty === null) {
            // Lokal har raderats
            onPropertyUpdate(prevProperties => prevProperties.filter(property => property.id !== selectedProperty.id));
            setSelectedProperty(null);
            showNotification('Lokal har raderats', 'success');
        } else {
            // Lokal har uppdaterats
            onPropertyUpdate(prevProperties => {
                const newProperties = prevProperties.map(property => 
                    property.id === updatedProperty.id ? {...updatedProperty} : property
                );
                console.log('New properties list:', newProperties);
                return newProperties;
            });
            setSelectedProperty(null);
            showNotification('Lokal har uppdaterats', 'success');
        }
        triggerRematching();
    };

    return (
        <div className="list-container property-list">
            <h2>Lokaler</h2>
            <div className="list-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Adress</th>
                            <th>Område</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={`property-${property.id}`} onClick={() => handlePropertyClick(property)}>
                                <td>{property.address}</td>
                                <td>{property.area}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedProperty && (
                <PropertyModal
                    property={selectedProperty}
                    onClose={handleCloseModal}
                    onPropertyUpdated={handlePropertyUpdated}
                />
            )}
        </div>
    );
}

export default PropertyList;
