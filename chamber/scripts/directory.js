const url = 'https://jcolmenarezgil.github.io/wdd231/chamber/data/members.json';
const cards = document.querySelector('#cards');
const gridButton = document.querySelector('#grid-style');
const listButton = document.querySelector('#list-style');

async function getCompanyData() {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        displaycompanys(data.companys);
    }
}

const displaycompanys = (companys) => {
    cards.innerHTML = ''; // Limpia el contenido anterior

    companys.forEach((company) => {
        let card = document.createElement('section');
        let companyName = document.createElement('h3');
        let phone = document.createElement('p');
        let email = document.createElement('p');
        let address = document.createElement('p');
        let website = document.createElement('p');
        let membership = document.createElement('p');
        let portrait = document.createElement('img');

        companyName.textContent = `${company.company_name}`;
        membership.textContent = `Membership: ${company.membership}`;
        if (company.membership === 'Gold') {
            card.setAttribute('class', 'gold');
        } else if (company.membership === 'Silver') {
            card.setAttribute('class', 'silver');
        } else if (company.membership === 'Member') {
            card.setAttribute('class', 'member');
        } else {
            card.setAttribute('class', 'default');
        }
        phone.textContent = `Phone: ${company.phone}`;
        address.textContent = `Address: ${company.address}`;
        website.textContent = `Website: ${company.website}`;
        email.textContent = `Email: ${company.email}`;

        portrait.setAttribute('src', company.imageurl);
        portrait.setAttribute('class', 'company-portrait');
        portrait.setAttribute('alt', `Portrait of ${company.company_name}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        card.appendChild(companyName);
        card.appendChild(phone);
        card.appendChild(email);
        card.appendChild(address);
        card.appendChild(website);
        card.appendChild(membership);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}

// Event listeners para los botones de alternancia
gridButton.addEventListener('click', () => {
    cards.classList.remove('list-view');
    cards.classList.add('grid-view');
    gridButton.classList.add('active');
    listButton.classList.remove('active');
});

listButton.addEventListener('click', () => {
    cards.classList.remove('grid-view');
    cards.classList.add('list-view');
    listButton.classList.add('active');
    gridButton.classList.remove('active');
});

getCompanyData();