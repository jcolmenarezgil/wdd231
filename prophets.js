const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        /* console.table(data); */
        displayProphets(data.companys);
    }
}

const displaycompanys = (companys) => {
    companys.forEach((company) => {
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');
        let portrait = document.createElement('img');

        fullName.textContent = `${company.company_name}`;
        birthDate.textContent = `Phone: ${company.phone}`;
        birthPlace.textContent = `Email: ${company.email}`;
        /* portrait.setAttribute('src', company.imageurl); */
        portrait.setAttribute('alt', `Portrait of ${company.company_name}`);
        /* portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440'); */

        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}

getProphetData();