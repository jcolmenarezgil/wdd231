// datetimeyear.js

/**
 * Updates the text content of the element with the ID 'current-year'
 * to the current full year.
 * Checks if the element exists before attempting to update it.
 */
export function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}