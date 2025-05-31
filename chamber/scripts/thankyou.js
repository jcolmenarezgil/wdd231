document.addEventListener('DOMContentLoaded', () => {
    displayFormData();
});

function displayFormData() {
    const params = new URLSearchParams(window.location.search);
    const displayArea = document.getElementById('formDataDisplay') || document.createElement('div');

    if (!document.getElementById('formDataDisplay')) {
        displayArea.id = 'formDataDisplay';
        document.body.appendChild(displayArea);
    }

    let htmlContent = '<h2>Your Application Details:</h2>';
    htmlContent += '<ul>';

    // 3. Iterar sobre los parámetros y construir el HTML
    for (const [key, value] of params.entries()) {
        let title = '';
        let displayValue = decodeURIComponent(value.replace(/\+/g, ' ')); // Decodifica los espacios y otros caracteres

        switch (key) {
            case 'name':
                title = 'First Name';
                break;
            case 'lastname':
                title = 'Last Name';
                break;
            case 'organizational-title':
                title = 'Organizational Title';
                break;
            case 'email':
                title = 'Email Address';
                break;
            case 'phone':
                title = 'Phone Number';
                break;
            case 'organization':
                title = 'Organization';
                break;
            case 'membership':
                title = 'Membership Level';
                // Puedes formatear el valor de la membresía para que sea más legible
                switch(displayValue) {
                    case 'non-profit':
                        displayValue = 'Non Profit Membership';
                        break;
                    case 'bronze':
                        displayValue = 'Bronze Membership';
                        break;
                    case 'silver':
                        displayValue = 'Silver Membership';
                        break;
                    case 'gold':
                        displayValue = 'Gold Membership';
                        break;
                }
                break;
            case 'description':
                title = 'Business Description';
                break;
            case 'timestamp':
                title = 'Submission Time';
                // Puedes formatear el timestamp para que sea más amigable
                try {
                    const date = new Date(displayValue);
                    displayValue = date.toLocaleString(); // Ejemplo: "1/1/2025, 10:30:00 AM"
                } catch (e) {
                    // Si el timestamp no es válido, mostrarlo tal cual
                }
                break;
            default:
                // Para cualquier otro parámetro no esperado
                title = key.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                break;
        }
        
        // Evitar mostrar el timestamp si está vacío (aunque el formulario lo llena)
        if (title && displayValue) {
            htmlContent += `<li><strong>${title}:</strong> ${displayValue}</li>`;
        }
    }

    htmlContent += '</ul>';
    displayArea.innerHTML = htmlContent;
}