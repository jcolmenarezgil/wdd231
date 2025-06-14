// main.mjs
import { updateCurrentYear } from './datetimeyear.js';
import { setActiveNavLink } from './active-nav.js';
import { renderProducts } from './product-renderer.js';
import { loadCatalogPage, updateUrlAndReloadCatalog } from './pagination.js';

function main() {
    console.log("Hello Ucaima Import!");

    updateCurrentYear();
    setActiveNavLink();
    console.log("Main function executed.");

    const currentPathname = window.location.pathname;

    const projectBase = '/project/';
    let cleanedCurrentPath = currentPathname;
    if (cleanedCurrentPath.startsWith(projectBase)) {
        cleanedCurrentPath = cleanedCurrentPath.substring(projectBase.length);
    }
    if (cleanedCurrentPath.startsWith('/')) {
        cleanedCurrentPath = cleanedCurrentPath.substring(1);
    }

    if (cleanedCurrentPath === 'catalog.html') {
        loadCatalogPage();
    } else if (cleanedCurrentPath === 'index.html' || cleanedCurrentPath === '') {
        renderProducts('featured-products-cards', 'rating_desc', 4);
        renderProducts('users-choice-cards', 'popular_desc', 4);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    main();
    console.log("Document is ready.");
});

