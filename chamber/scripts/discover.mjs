// discover.mjs

import { places } from '../data/places.js';

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

document.addEventListener('DOMContentLoaded', loadPlaces);