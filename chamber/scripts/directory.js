const url = 'https://jcolmenarezgil.github.io/wdd231/chamber/data/members.json';

// Selecciona los elementos, pueden ser null si no existen
const cardsContainer = document.querySelector('#cards');
const gridButton = document.querySelector('#grid-style');
const listButton = document.querySelector('#list-style');

/**
 * Renderiza las compañías en el contenedor especificado.
 * @param {Array} companys - La lista de compañías a mostrar.
 * @param {HTMLElement} container - El elemento HTML donde se renderizarán las tarjetas.
 * @param {boolean} [filterGoldSilver=false] - Si es true, solo muestra miembros Gold y Silver.
 */
const displayCompanys = (companys, container, filterGoldSilver = false) => {
    if (!container) {
        console.warn('El contenedor para las compañías no fue encontrado. No se renderizarán los datos.');
        return; // Sale de la función si no hay contenedor
    }

    container.innerHTML = ''; // Limpia el contenido actual

    let companiesToDisplay = companys;

    if (filterGoldSilver) {
        companiesToDisplay = companys.filter(company =>
            company.membership === 'Gold' || company.membership === 'Silver'
        );
    }

    // Ordenar las compañías Gold/Silver de forma aleatoria (opcional, para la homepage)
    if (filterGoldSilver) {
        // Shuffle the array and pick top 3
        companiesToDisplay = shuffleArray(companiesToDisplay).slice(0, 3);
    }


    companiesToDisplay.forEach((company) => {
        let card = document.createElement('section');
        let companyName = document.createElement('h3');
        let phone = document.createElement('p');
        let email = document.createElement('p');
        let address = document.createElement('p');
        let website = document.createElement('a'); // Ahora es un enlace
        let membership = document.createElement('p');
        let portrait = document.createElement('img');

        companyName.textContent = company.company_name;
        membership.textContent = `Membership: ${company.membership}`;

        // Asignación de clases CSS
        if (company.membership === 'Gold') {
            card.setAttribute('class', 'gold');
        } else if (company.membership === 'Silver') {
            card.setAttribute('class', 'silver');
        } else {
            card.setAttribute('class', 'default');
        }

        phone.textContent = `Phone: ${company.phone}`;
        address.textContent = `Address: ${company.address}`;
        email.textContent = `Email: ${company.email}`;

        website.setAttribute('href', company.website);
        website.setAttribute('target', '_blank');
        website.setAttribute('rel', 'noopener noreferrer');
        website.textContent = `Website`; // O company.website si quieres mostrar la URL completa

        portrait.setAttribute('src', company.imageurl);
        portrait.setAttribute('class', 'company-portrait');
        portrait.setAttribute('alt', `Logo of ${company.company_name}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', 'auto'); // Mejor para mantener la proporción

        card.appendChild(portrait);
        card.appendChild(companyName);
        card.appendChild(membership);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(email);
        card.appendChild(website);

        container.appendChild(card);
    });
};

// Función para desordenar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function getCompanyDataAndDisplay() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();

            // Lógica para el contenedor #cards
            if (cardsContainer) { // Si #cards existe
                displayCompanys(data.companys, cardsContainer); // Mostrar todas las compañías (o aplicar filtro si lo necesitas aquí)
                // Establece la vista inicial si los botones existen
                if (gridButton && listButton) {
                    cardsContainer.classList.add('grid-view'); // Vista por defecto
                    gridButton.classList.add('active');
                }
            }

            // Aquí puedes añadir lógica para otro lugar donde quieras mostrar las compañías.
            // Por ejemplo, si tienes un div en la página principal para "Miembros Destacados"
            const featuredMembersContainer = document.querySelector('#featured-members');
            if (featuredMembersContainer) {
                // Mostrar solo los Gold/Silver y quizás un número limitado (ej. 3)
                displayCompanys(data.companys, featuredMembersContainer, true);
                featuredMembersContainer.classList.add('featured-grid-view'); // Añade una clase para estilos específicos
            }

        } else {
            console.error('Error al cargar los datos de las compañías:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Event listeners (solo se añaden si los botones existen)
if (gridButton && cardsContainer) {
    gridButton.addEventListener('click', () => {
        cardsContainer.classList.remove('list-view');
        cardsContainer.classList.add('grid-view');
        gridButton.classList.add('active');
        if (listButton) listButton.classList.remove('active');
    });
}

if (listButton && cardsContainer) {
    listButton.addEventListener('click', () => {
        cardsContainer.classList.remove('grid-view');
        cardsContainer.classList.add('list-view');
        listButton.classList.add('active');
        if (gridButton) gridButton.classList.remove('active');
    });
}

// Inicia la carga de datos
getCompanyDataAndDisplay();