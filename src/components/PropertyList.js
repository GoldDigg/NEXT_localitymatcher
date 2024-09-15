'use client';

import React, { useState } from 'react';
import PropertyModal from './PropertyModal';
import { useNotification } from './NotificationContext';

function PropertyList({ properties, onPropertyUpdate, triggerRematching }) {
    const [selectedProperty, setSelectedProperty] = useState(null);
    const { showNotification } = useNotification();

    const handlePropertyClick = (property) => {
        setSelectedProperty(property);
    };

    const handleCloseModal = () => {
        setSelectedProperty(null);
    };

    const handlePropertyUpdated = (updatedProperty) => {
        onPropertyUpdate(updatedProperty);
        setSelectedProperty(null);
        showNotification('Fastighet uppdaterad', 'success');
        triggerRematching(); // Lägg till denna rad
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
