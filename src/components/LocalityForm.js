const { useState } = React;

function LocalityForm() {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Här kan du lägga till logik för att skicka lokaliteten till servern
        console.log('Locality submitted:', name);
        setName('');
    };

    return React.createElement('div', { className: "card" },
        React.createElement('h2', null, 'Add Locality'),
        React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('input', {
                type: 'text',
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: 'Locality Name',
                required: true
            }),
            React.createElement('button', { type: 'submit' }, 'Add Locality')
        )
    );
}

export default LocalityForm;
