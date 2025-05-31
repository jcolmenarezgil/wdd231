import { memberships } from '../data/memberships.js';

const membershipDetails = document.querySelector("#membershipDetails");
const membershipLevels = document.querySelector("#membershipLevels");

function displayMembershipTiers(memberships) {
    membershipLevels.innerHTML = '';
    memberships.forEach(membership => {
        const membershipItem = document.createElement('div');
        membershipItem.classList.add(`${membership.level_tag}`, 'card-membership');
        membershipItem.innerHTML = `
        <div class="order">
        <div class="medal"><img src='images/${membership.level_medal}.webp' loading='lazy'></div>
        <div class="card-lines">
        <h3>${membership.membership_type}</h3>
        <p><strong>$${membership.membership_fee},<sup>00</sup></strong></p>
        <span> Show more details </span>
        </div>
        </div>
        `;
        membershipItem.addEventListener('click', () => displayMembershipDetails(membership));
        membershipLevels.appendChild(membershipItem);
    })
}

function displayMembershipDetails(membership) {

    const benefitsListItems = membership.membership_tier.benefits.map(benefit => `<li>${benefit}</li>`).join('');

    membershipDetails.innerHTML = '';
    membershipDetails.innerHTML = `
    <button id="closeModal"> ❌ </button>
    <h2>${membership.membership_type}</h2>
    <p>Cost: ${membership.membership_fee.toFixed(2)}</p>
    <ul>
        ${benefitsListItems}
    </ul>
    `;
    membershipDetails.showModal();

    const closeModalButton = document.querySelector("#closeModal");
    closeModalButton.addEventListener('click', () => {
        membershipDetails.close();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayMembershipTiers(memberships);
});

const applicantForm = document.querySelector('.applicant');

applicantForm.addEventListener('submit', function (event) {
    const timestampField = document.getElementById('timestamp');
    const now = new Date();
    timestampField.value = now.toISOString();
});