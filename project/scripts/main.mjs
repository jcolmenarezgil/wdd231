// scripts/main.mjs
import { updateCurrentYear } from './datetimeyear.js';
import { setActiveNavLink } from './active-nav.js';
import { renderProducts } from './product-renderer.js';
import { loadCatalogPage } from './pagination.js';
import { initializeCartHandlers, renderCartItems } from './cart.js';

function main() {
    console.log("Hello Ucaima Import!");
    updateCurrentYear();
    setActiveNavLink();
    console.log("Main function executed.");
    
    initializeCartHandlers(); 
    console.log("Cart initialized.");

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
        renderProducts('featured-products-cards', 'top-rated', 4);
        renderProducts('users-choice-cards', 'most-reviewed', 4);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    main();
    console.log("Document is ready.");
});

