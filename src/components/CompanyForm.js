'use client'; // Detta gör komponenten till en klientkomponent

import React, { useState, useCallback, useEffect } from 'react';
import { useConfirmation } from './ConfirmationContext';
import { debounce } from 'lodash';
import { useNotification } from './NotificationContext';
import { format } from 'date-fns';
import SelectableTags from './SelectableTags';
import { useRouter } from 'next/navigation';
import SelectableAreas from './SelectableAreas';
import { capitalizeFirstLetter } from '../utils/stringUtils';

function CompanyForm({ onCompanyAdded }) {
    const { showConfirmation } = useConfirmation();
    const { showNotification } = useNotification();
    const [name, setName] = useState('');
    const [orgNumber, setOrgNumber] = useState('');
    const [orgNumberError, setOrgNumberError] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [area, setArea] = useState('');
    const [size, setSize] = useState('');
    const [rent, setRent] = useState('');
    const [egenskaper, setEgenskaper] = useState([]);
    const [contractEndDate, setContractEndDate] = useState('');
    const [desiredAreas, setDesiredAreas] = useState([]);
    const [desiredSizeMin, setDesiredSizeMin] = useState('');
    const [desiredSizeMax, setDesiredSizeMax] = useState('');
    const [desiredMaxRent, setDesiredMaxRent] = useState('');
    const [desiredEgenskaper, setDesiredEgenskaper] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitCount, setFormSubmitCount] = useState(0);
    const router = useRouter();
    const [featuresOptions, setFeaturesOptions] = useState([]);
    const [areasOptions, setAreasOptions] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState([]); // State för att lagra taggar
    const [areas, setAreas] = useState([]); // Nytt state för områden
    const [newArea, setNewArea] = useState(''); // State för att lagra nytt område
    const [selectedArea, setSelectedArea] = useState('');

    useEffect(() => {
        const fetchTagsAndAreas = async () => {
            try {
                const [tagsResponse, areasResponse] = await Promise.all([
                    fetch('/api/tags'),
                    fetch('/api/areas')
                ]);
                if (!tagsResponse.ok || !areasResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const tagsData = await tagsResponse.json();
                const areasData = await areasResponse.json();

                const egenskaper = tagsData.filter(tag => tag.type === 'egenskap');
                setFeaturesOptions(egenskaper.sort((a, b) => a.name.localeCompare(b.name)));
                setAreasOptions(areasData.sort((a, b) => a.name.localeCompare(b.name)));
                setAreas(areasData.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTagsAndAreas();
    }, []);

    const validateOrgNumberFormat = (orgNumber) => {
        const regex = /^\d{6}-\d{4}$/;
        return regex.test(orgNumber);
    };

    const validateOrgNumber = async (orgNumber) => {
        console.log('Validating org number:', orgNumber);
        if (!validateOrgNumberFormat(orgNumber)) {
            console.log('Invalid format');
            return false;
        }
        try {
            const response = await fetch(`/api/check_org_number?orgNumber=${orgNumber}`);
            console.log('API response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API response data:', data);

            if (typeof data.exists === 'boolean') {
                return !data.exists; // Returnera true om organisationsnumret INTE existerar
            } else {
                console.error('Unexpected API response format:', data);
                return false; // Anta att det är ett fel och returnera false
            }
        } catch (error) {
            console.error('Error validating org number:', error);
            return false; // Anta att det är ett fel och returnera false
        }
    };

    const debouncedValidate = useCallback(
        debounce(async (value) => {
            if (!validateOrgNumberFormat(value)) {
                setOrgNumberError('Ogiltigt format. Använd XXXXXX-XXXX');
                return;
            }
            const isValid = await validateOrgNumber(value);
            console.log('Is valid:', isValid);
            setOrgNumberError(isValid ? '' : 'Organisationsnumret finns redan');
        }, 300),
        []
    );

    const handleOrgNumberChange = (e) => {
        const value = e.target.value;
        setOrgNumber(value);
        if (value.trim() !== '') {
            debouncedValidate(value);
        } else {
            setOrgNumberError('');
        }
    };

    const capitalizeFirstLetter = (string) => {
        if (typeof string !== 'string' || string.length === 0) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleAreaChange = (e) => {
        setArea(capitalizeFirstLetter(e.target.value));
    };

    const handleEgenskaperTags = (newTags) => {
        const uniqueTags = newTags.filter(tag =>
            !egenskaper.some(existingTag =>
                existingTag.toLowerCase() === capitalizeFirstLetter(tag).toLowerCase()
            )
        );

        if (uniqueTags.length < newTags.length) {
            showNotification('En eller flera egenskaper finns redan i listan', 'info');
        }

        setEgenskaper([...egenskaper, ...uniqueTags.map(capitalizeFirstLetter)]);
    };

    const handleDesiredAreasTags = (newTags) => {
        if (newTags.length === 0) return; // Kontrollera om det finns några taggar
        const formattedTag = capitalizeFirstLetter(newTags[newTags.length - 1]);
        if (!desiredAreas.includes(formattedTag)) {
            setDesiredAreas([...desiredAreas, formattedTag]);
        } else {
            showNotification('Detta område finns redan i listan', 'info');
        }
    };

    const handleDesiredEgenskaperTags = (newTags) => {
        if (newTags.length === 0) return; // Kontrollera om det finns några taggar
        const formattedTag = capitalizeFirstLetter(newTags[newTags.length - 1]);
        if (!desiredEgenskaper.includes(formattedTag)) {
            setDesiredEgenskaper([...desiredEgenskaper, formattedTag]);
        } else {
            showNotification('Denna egenskap finns redan i listan', 'info');
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Förhindra standardbeteendet för Enter
        }
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || orgNumberError) {
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Validating org number before submission:', orgNumber);
            const isValid = await validateOrgNumber(orgNumber);
            console.log('Org number validation result:', isValid);
            if (!isValid) {
                setOrgNumberError('Organisationsnumret finns redan');
                setIsSubmitting(false);
                return;
            }

            const formattedDate = contractEndDate ? format(new Date(contractEndDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined;

            const companyData = {
                name,
                orgNumber,
                streetAddress: streetAddress || undefined,
                area: area || undefined,
                size: size ? parseFloat(size) : undefined,
                rent: rent ? parseFloat(rent) : undefined,
                egenskaper,
                contractEndDate: formattedDate,
                desiredAreas,
                desiredSizeMin: desiredSizeMin ? parseFloat(desiredSizeMin) : undefined,
                desiredSizeMax: desiredSizeMax ? parseFloat(desiredSizeMax) : undefined,
                desiredMaxRent: desiredMaxRent ? parseFloat(desiredMaxRent) : undefined,
                desiredEgenskaper
            };

            console.log('Sending company data:', companyData);
            console.log('Egenskaper:', companyData.egenskaper);
            console.log('Desired Areas:', companyData.desiredAreas);
            console.log('Desired Egenskaper:', companyData.desiredEgenskaper);

            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            const data = await response.json();
            console.log('Company created:', data);
            showNotification(`"${data.name}" har lagts till`);

            // Reset all form fields
            setName('');
            setOrgNumber('');
            setOrgNumberError('');
            setStreetAddress('');
            setArea('');
            setSize('');
            setRent('');
            setEgenskaper([]); // Reset egenskaper array
            setContractEndDate('');
            setDesiredAreas([]); // Reset desiredAreas array
            setDesiredSizeMin('');
            setDesiredSizeMax('');
            setDesiredMaxRent('');
            setDesiredEgenskaper([]); // Reset desiredEgenskaper array
            setFormSubmitCount(prev => prev + 1);

            if (onCompanyAdded) {
                onCompanyAdded(data);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Ett fel uppstod: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = async (e) => {
        e.preventDefault();
        if (!newTag.trim()) return;

        const formattedTag = capitalizeFirstLetter(newTag.trim());

        if (!featuresOptions.some(tag => tag.name.toLowerCase() === formattedTag.toLowerCase())) {
            try {
                const response = await fetch('/api/tags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        name: formattedTag, 
                        type: 'egenskap',
                        tag: formattedTag  // Lägg till detta
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to add tag');
                }

                const savedTag = await response.json();
                setFeaturesOptions(prev => [...prev, savedTag]);
                setNewTag('');
                showNotification(`Egenskap "${formattedTag}" har lagts till`, 'success');
            } catch (error) {
                console.error('Error adding tag:', error);
                showNotification(`Ett fel uppstod: ${error.message}`, 'error');
            }
        } else {
            showNotification('Denna egenskap finns redan i listan', 'info');
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

                // Uppdatera featuresOptions eller areasOptions baserat på taggens typ
                if (tag.type === 'egenskap') {
                    setFeaturesOptions(prevOptions => prevOptions.filter(t => t.id !== tag.id));
                } else if (tag.type === 'area') {
                    setAreasOptions(prevOptions => prevOptions.filter(t => t.id !== tag.id));
                }

                // Uppdatera tags state
                setTags(prevTags => prevTags.filter(t => t.id !== tag.id));

                showNotification(`Taggen har tagits bort`, 'success');
            } catch (error) {
                console.error('Error removing tag:', error);
                showNotification(`Kunde inte ta bort taggen: ${error.message}`, 'error');
            }
        });
    };

    const handleAddArea = async () => {
        if (newArea.trim() === '') return;
        const formattedArea = capitalizeFirstLetter(newArea);

        if (!areasOptions.some(area => area.name.toLowerCase() === formattedArea.toLowerCase())) {
            try {
                const response = await fetch('/api/areas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formattedArea, type: 'area' }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newAreaData = await response.json();
                const updatedAreas = [...areasOptions, newAreaData];
                setAreasOptions(updatedAreas);
                handleAreasChange(updatedAreas);
                setNewArea('');
                showNotification(`Område "${formattedArea}" har lagts till`, 'success');
            } catch (error) {
                console.error('Error adding area:', error);
                showNotification('Något gick fel vid tillägg av område', 'error');
            }
        } else {
            showNotification('Detta område finns redan i listan', 'info');
        }
    };

    const handleAreasChange = (newAreas) => {
        setAreasOptions(newAreas);
        // Om det valda området har tagits bort, återställ valet
        if (!newAreas.some(area => area.id === selectedArea)) {
            setSelectedArea('');
        }
    };

    const TagDisplay = ({ tags, handleRemoveTag }) => {
        return (
            <div className="tags-container">
                {tags.map((tag) => (
                    <span key={tag.id} className="tag">
                        {tag.name}
                        <button onClick={() => handleRemoveTag(tag)} className="remove-tag">✖</button>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="card company-form">
            <h2>Lägg till företag</h2>
            <form onSubmit={handleCompanySubmit}>
                <div className="form-group custom-form-group">
                    <label htmlFor="name" className="custom-label">Företagsnamn</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="custom-input"
                        key={`name-${isSubmitting}`}
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="orgNumber" className="custom-label">Org nummer (XXXXXX-XXXX)</label>
                    <input
                        id="orgNumber"
                        type="text"
                        value={orgNumber}
                        onChange={handleOrgNumberChange}
                        required
                        className={`custom-input ${orgNumberError ? 'error' : ''}`}
                        placeholder="XXXXXX-XXXX"
                        pattern="\d{6}-\d{4}"
                        title="Ange organisationsnummer i formatet XXXXXX-XXXX"
                    />
                    {orgNumberError && <div className="error-message">{orgNumberError}</div>}
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="streetAddress" className="custom-label">Gatuadress</label>
                    <input
                        id="streetAddress"
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="area">Område</label>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">Välj område</option>
                        {areasOptions.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="size" className="custom-label">Storlek (kvm)</label>
                    <input
                        id="size"
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="rent" className="custom-label">Hyra (kr/kvm/år)</label>
                    <input
                        id="rent"
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="egenskaper">Egenskaper</label>
                    <SelectableTags
                        options={featuresOptions}
                        setOptions={setFeaturesOptions}
                        selectedTags={egenskaper}
                        setSelectedTags={setEgenskaper}
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="contractEndDate" className="custom-label">Avtalstid t.o.m.</label>
                    <input
                        id="contractEndDate"
                        type="date"
                        value={contractEndDate}
                        onChange={(e) => setContractEndDate(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="desiredAreas">Önskade områden</label>
                    <SelectableAreas
                        options={areasOptions}
                        selectedAreas={desiredAreas}
                        setSelectedAreas={setDesiredAreas}
                        setOptions={setAreasOptions}
                        onAreasChange={handleAreasChange}
                    />
                </div>
                <div className="form-group custom-form-group">
                    <label className="custom-label">Önskad storlek (kvm)</label>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <input
                            type="number"
                            value={desiredSizeMin}
                            onChange={(e) => setDesiredSizeMin(e.target.value)}
                            className="custom-input"
                            placeholder="Min"
                            style={{ flex: 1 }}
                        />
                        <span style={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>-</span>
                        <input
                            type="number"
                            value={desiredSizeMax}
                            onChange={(e) => setDesiredSizeMax(e.target.value)}
                            className="custom-input"
                            placeholder="Max"
                            style={{ flex: 1 }}
                        />
                    </div>
                </div>
                <div className="form-group custom-form-group">
                    <label htmlFor="desiredMaxRent" className="custom-label">Önskad maxhyra (kr/kvm/år)</label>
                    <input
                        id="desiredMaxRent"
                        type="number"
                        value={desiredMaxRent}
                        onChange={(e) => setDesiredMaxRent(e.target.value)}
                        className="custom-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="desiredEgenskaper">Önskade egenskaper</label>
                    <SelectableTags
                        options={featuresOptions}
                        setOptions={setFeaturesOptions}
                        selectedTags={desiredEgenskaper}
                        setSelectedTags={setDesiredEgenskaper}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button
                        type="submit"
                        disabled={isSubmitting || !!orgNumberError}
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
                            cursor: isSubmitting || !!orgNumberError ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting || !!orgNumberError ? 0.6 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isSubmitting ? 'Lägger till...' : 'Lägg till företag'}
                    </button>
                </div>
            </form>

            <hr style={{
                margin: '20px 0',
                border: 'none',
                borderTop: '1px solid #ccc'
            }} />

            <div className="form-group">
                <label htmlFor="newArea">Lägg till ett nytt område</label>
                <div className="add-item-container">
                    <input
                        type="text"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddArea();
                            }
                        }}
                        placeholder="Nytt område"
                        className="custom-input"
                    />
                    <button type="button" onClick={handleAddArea} className="add-button">Lägg till</button>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="newTag">Lägg till en ny egenskap</label>
                <div className="add-item-container">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag(e);
                            }
                        }}
                        placeholder="Ny egenskap"
                        className="custom-input"
                    />
                    <button type="button" onClick={handleAddTag} className="add-button">Lägg till</button>
                </div>
            </div>

            <TagDisplay tags={tags} handleRemoveTag={handleRemoveTag} />

            <style jsx>{`
                .tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 10px;
                }
                .tag {
                    background-color: white;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 5px 10px;
                    margin: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    position: relative;
                }
                .tag:hover {
                    background-color: #f0f0f0;
                }
                .remove-tag {
                    display: none;
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .tag:hover .remove-tag {
                    display: block;
                }
                .add-item-container {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .custom-input {
                    flex: 1;
                    min-width: 150px;
                    max-width: 300px;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .add-button {
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .add-button:hover {
                    background-color: #45a049;
                }
            `}</style>
        </div>
    );
}

export default CompanyForm;