const url = 'https://jcolmenarezgil.github.io/wdd231/chamber/data/members.json';


const cardsContainer = document.querySelector('#cards');
const gridButton = document.querySelector('#grid-style');
const listButton = document.querySelector('#list-style');

const displayCompanys = (companys, container, filterGoldSilver = false) => {
    if (!container) {
        console.warn('Container Company not found');
        return; 
    }

    container.innerHTML = '';

    let companiesToDisplay = companys;

    if (filterGoldSilver) {
        companiesToDisplay = companys.filter(company =>
            company.membership === 'Gold' || company.membership === 'Silver'
        );
    }

    if (filterGoldSilver) {
       
        companiesToDisplay = shuffleArray(companiesToDisplay).slice(0, 3);
    }


    companiesToDisplay.forEach((company) => {
        let card = document.createElement('section');
        let companyName = document.createElement('h3');
        let phone = document.createElement('p');
        let email = document.createElement('p');
        let address = document.createElement('p');
        let website = document.createElement('a');
        let membership = document.createElement('p');
        let portrait = document.createElement('img');

        companyName.textContent = company.company_name;
        membership.textContent = `Membership: ${company.membership}`;

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
        website.setAttribute('class', 'company-website');
        website.textContent = `Website`; 

        portrait.setAttribute('src', company.imageurl);
        portrait.setAttribute('class', 'company-portrait');
        portrait.setAttribute('alt', `Logo of ${company.company_name}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', 'auto'); 

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

            
            if (cardsContainer) { 
                displayCompanys(data.companys, cardsContainer); 
                
                if (gridButton && listButton) {
                    cardsContainer.classList.add('grid-view'); 
                    gridButton.classList.add('active');
                }
            }

            const featuredMembersContainer = document.querySelector('#featured-members');
            if (featuredMembersContainer) {
                
                displayCompanys(data.companys, featuredMembersContainer, true);
                featuredMembersContainer.classList.add('featured-grid-view'); 
            }

        } else {
            console.error('Error al cargar los datos de las compañías:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

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

getCompanyDataAndDisplay();