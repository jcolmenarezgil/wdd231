// scripts/details-toggler.js

/**
 * Checks if the current page is catalog.html and the screen width is less than 768px.
 * If true, it removes the 'open' attribute from the specified details element.
 */
export function initializeDetailsToggle() {
    const detailsElement = document.querySelector('details'); 
    
    if (!detailsElement) {
        console.log("No <details> element found on this page. Details toggle not initialized.");
        return;
    }

    const currentPathname = window.location.pathname;
    const isCatalogPage = currentPathname.endsWith('/catalog.html');
    const isSmallScreen = window.innerWidth < 768;

    if (isCatalogPage && isSmallScreen) {
        detailsElement.removeAttribute('open');
        console.log("Details element 'open' attribute removed for small screen on catalog page.");
    } else {
        console.log("Details element 'open' attribute retained (not catalog page or large screen).");
    }

    window.addEventListener('resize', () => {
        const currentIsSmallScreen = window.innerWidth < 768;

        if (isCatalogPage) { 
            if (currentIsSmallScreen && detailsElement.hasAttribute('open')) {
                
                detailsElement.removeAttribute('open');
                console.log("Details element 'open' attribute removed on resize to small screen.");
            } else if (!currentIsSmallScreen && !detailsElement.hasAttribute('open')) {
                // detailsElement.setAttribute('open', '');
            }
        }
    });
}