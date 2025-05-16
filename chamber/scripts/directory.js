const url = 'https://jcolmenarezgil.github.io/wdd231/chamber/chamber-directory.json';
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
        let companyName = document.createElement('h2');
        let phone = document.createElement('p');
        let email = document.createElement('p');
        let portrait = document.createElement('img');

        companyName.textContent = `${company.company_name}`;
        phone.textContent = `Phone: ${company.phone}`;
        email.textContent = `Email: ${company.email}`;
        portrait.setAttribute('src', company.imageurl);
        portrait.setAttribute('alt', `Portrait of ${company.company_name}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        card.appendChild(companyName);
        card.appendChild(phone);
        card.appendChild(email);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}

getCompanyData();