import React from 'react';
import styles from './SelectableAreas.module.css'; // Importera CSS-modulen
import { useConfirmation } from './ConfirmationContext'; // Importera useConfirmation
import { useNotification } from './NotificationContext'; // Importera useNotification

const SelectableAreas = ({ options, selectedAreas, setSelectedAreas, setOptions, onAreasChange }) => {
    const { showConfirmation } = useConfirmation(); // Använda useConfirmation
    const { showNotification } = useNotification(); // Hämta showNotification

    const handleAreaClick = (area) => {
        if (selectedAreas.some(a => a.id === area.id)) {
            setSelectedAreas(selectedAreas.filter(a => a.id !== area.id)); // Ta bort området om det redan är valt
        } else {
            setSelectedAreas([...selectedAreas, area]); // Lägg till området
        }
    };

    const handleRemoveArea = async (area) => {
        console.log('Removing area:', area);
        showConfirmation(`Är du säker på att du vill ta bort området "${area.name}"?`, async () => {
            try {
                const response = await fetch(`/api/areas/${area.id}`, {
                    method: 'DELETE',
                });

                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to delete area: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Deleted area:', data);

                setOptions(prevOptions => {
                    const newOptions = prevOptions.filter(a => a.id !== area.id);
                    onAreasChange(newOptions); // Anropa callback-funktionen
                    return newOptions;
                });
                setSelectedAreas(prevAreas => prevAreas.filter(a => a.id !== area.id));

                showNotification(`Området har tagits bort`, 'success');
            } catch (error) {
                console.error('Error removing area:', error);
                showNotification(`Kunde inte ta bort området: ${error.message}`, 'error');
            }
        });
    };

    return (
        <div className={styles.selectableAreasContainer}>
            {options.map((area) => (
                <div
                    key={area.id} // Se till att area.id är unikt
                    className={`${styles.area} ${selectedAreas.some(a => a.id === area.id) ? styles.selected : ''}`}
                    onClick={() => handleAreaClick(area)}
                >
                    <span>{area.name}</span>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveArea(area);
                    }} className={styles.removeButton}>✖</button>
                </div>
            ))}
        </div>
    );
};

export default SelectableAreas;
