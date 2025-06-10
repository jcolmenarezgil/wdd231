// discover.mjs

import { places } from '../data/places.js';

const LAST_VISIT_KEY = 'lastVisitTimestamp'; 
const WELCOME_DIALOG_ID = 'welcomeDialog';
const WELCOME_MESSAGE_ID = 'welcomeMessage';
const CLOSE_DIALOG_BTN_ID = 'closeModal';

function getWelcomeMessage() {
    const now = Date.now();
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

    if (!lastVisit) {
        
        localStorage.setItem(LAST_VISIT_KEY, now); 
        return "Welcome! This is your first visit.";
    }

    const lastVisitTimestamp = parseInt(lastVisit, 10);
    const timeElapsed = now - lastVisitTimestamp; 
    const oneDayInMs = 24 * 60 * 60 * 1000; 

    localStorage.setItem(LAST_VISIT_KEY, now); 

    if (timeElapsed < oneDayInMs) {
        
        return "Welcome back! We hope you find the information you are looking for.";
    } else {
        
        const lastVisitDate = new Date(lastVisitTimestamp);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = lastVisitDate.toLocaleDateString('en-US', options);

        return `Last visit was on ${formattedDate}. We hope you enjoy your stay with us.`;
    }
}

function showWelcomeDialog() {
    const dialog = document.getElementById(WELCOME_DIALOG_ID);
    const messageElement = document.getElementById(WELCOME_MESSAGE_ID);
    const closeBtn = document.getElementById(CLOSE_DIALOG_BTN_ID);

    if (dialog && messageElement && closeBtn) {
        messageElement.textContent = getWelcomeMessage();

       
        dialog.showModal();

        
        closeBtn.onclick = () => {
            dialog.close();
        };

        
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

    } else {
        console.error('No se encontraron los elementos del diálogo de bienvenida.');
    }
}

/* loadPlaces */

function loadPlaces() {
    const placesRegion = document.getElementById('placesRegion');
    placesRegion.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.classList.add('place-card');

        const titleElement = document.createElement('h2');
        titleElement.textContent = place.title;

        const imageElement = document.createElement('img');
        imageElement.src = `images/${place.url_image}`;
        imageElement.alt = place.title;
        imageElement.title = place.title;
        imageElement.loading = 'lazy';

        const descriptionElement = document.createElement('p');
        descriptionElement.innerHTML = place.description;

        const learnMoreButton = document.createElement('button');
        learnMoreButton.textContent = 'Learn More';
        learnMoreButton.classList.add('learn-more-btn');

        learnMoreButton.addEventListener('click', () => {
            alert(`You have clicked on ‘Learn More’ to ${place.title}!`);
        });

        const locationElement = document.createElement('div');
        locationElement.classList.add('address');
        locationElement.textContent = place.location;

        placeCard.appendChild(titleElement);
        placeCard.appendChild(imageElement);
        placeCard.appendChild(descriptionElement);
        placeCard.appendChild(learnMoreButton);
        placeCard.appendChild(locationElement);

        placesRegion.appendChild(placeCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPlaces();
    showWelcomeDialog();
});