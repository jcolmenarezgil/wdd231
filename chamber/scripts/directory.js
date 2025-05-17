const url = 'https://jcolmenarezgil.github.io/wdd231/chamber/data/members.json';
const cards = document.querySelector('#cards');

async function getCompanyData() {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        /* console.table(data); */
        displaycompanys(data.companys);
    }
}

const displaycompanys = (companys) => {
    companys.forEach((company) => {
        let card = document.createElement('section');
        let companyName = document.createElement('h3');
        let phone = document.createElement('p');
        let email = document.createElement('p');
        let address = document.createElement('p');
        let website = document.createElement('p');
        let portrait = document.createElement('img');

        companyName.textContent = `${company.company_name}`;
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
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}

getCompanyData();