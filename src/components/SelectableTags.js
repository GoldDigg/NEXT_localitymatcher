import React from 'react';
import styles from './SelectableTags.module.css'; // Importera CSS-modulen
import { useConfirmation } from './ConfirmationContext'; // Importera useConfirmation
import { useNotification } from './NotificationContext'; // Importera useNotification

const SelectableTags = ({ options, selectedTags, setSelectedTags, setOptions }) => {
    const { showConfirmation } = useConfirmation(); // Använda useConfirmation
    const { showNotification } = useNotification(); // Hämta showNotification

    const handleTagClick = (tag) => {
        if (selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id)); // Ta bort taggen om den redan är vald
        } else {
            setSelectedTags([...selectedTags, tag]); // Lägg till taggen
        }
    };

    const handleRemoveTag = async (tag) => {
        console.log('Removing tag:', tag);
        showConfirmation(`Är du säker på att du vill ta bort taggen "${tag.name}"?`, async () => {
            try {
                const response = await fetch(`/api/tags/${tag.id}`, {
                    method: 'DELETE',
                });

                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to delete tag: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Deleted tag:', data);

                // Uppdatera options för att ta bort taggen
                setOptions(prevOptions => prevOptions.filter(t => t.id !== tag.id));

                // Uppdatera selectedTags om taggen var vald
                setSelectedTags(prevTags => prevTags.filter(t => t.id !== tag.id));

                showNotification(`Taggen har tagits bort`, 'success');
            } catch (error) {
                console.error('Error removing tag:', error);
                showNotification(`Kunde inte ta bort taggen: ${error.message}`, 'error');
            }
        });
    };

    return (
        <div className={styles.selectableTagsContainer}>
            {options.map((tag) => (
                <div
                    key={tag.id} // Se till att tag.id är unikt
                    onClick={() => handleTagClick(tag)}
                    className={`${styles.tag} ${selectedTags.some(t => t.id === tag.id) ? styles.selected : ''}`}
                >
                    {tag.name} {/* Se till att du renderar tag.name korrekt här */}
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }} className={styles.removeButton}>✖</button> {/* Kryssknapp */}
                </div>
            ))}
        </div>
    );
};

export default SelectableTags;
