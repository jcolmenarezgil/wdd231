// scripts/main.mjs
import { updateCurrentYear } from './datetimeyear.js';
import { setActiveNavLink } from './active-nav.js';
import { renderProducts } from './product-renderer.js';
import { loadCatalogPage } from './pagination.js';
import { initializeCartHandlers, renderCartItems } from './cart.js';
import { initializeOrderConfirmationPage } from './order-confirmation.js';
import { initializeHamburgerMenu } from './navigation.js';
import { initializeDetailsToggle } from './details-toggler.js';

function main() {
    console.log("Hello Ucaima Import!");
    updateCurrentYear();
    setActiveNavLink();
    console.log("Main function executed.");

    initializeCartHandlers();
    console.log("Cart initialized.");

    initializeHamburgerMenu();
    console.log("Hamburger menu initialized.");

    if (window.location.pathname.endsWith('/order-confirmation.html')) {
        initializeOrderConfirmationPage();
    }

    initializeDetailsToggle();
    console.log("Details toggle initialized.");

    const currentPathname = window.location.pathname;

    const projectBase = '/wdd231/project/';

    let cleanedCurrentPath = currentPathname;
    if (cleanedCurrentPath.startsWith(projectBase)) {
        cleanedCurrentPath = cleanedCurrentPath.substring(projectBase.length);
    }
    if (cleanedCurrentPath.startsWith('/')) {
        cleanedCurrentPath = cleanedCurrentPath.substring(1);
    }

    if (cleanedCurrentPath === 'catalog.html') {
        loadCatalogPage();
    } else if (cleanedCurrentPath === 'cart.html') {
        renderCartItems();
    } else if (cleanedCurrentPath === 'index.html' || cleanedCurrentPath === '') {
        renderProducts('featured-products-cards', 'rating_desc', 4);
        renderProducts('users-choice-cards', 'popular_desc', 4);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    main();
    console.log("Document is ready.");
});

