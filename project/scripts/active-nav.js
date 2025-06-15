// js/active-nav.js

export function setActiveNavLink() {
    const navLinks = document.querySelectorAll('header nav a');
    const currentFullUrl = window.location.href;
    const currentPathname = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);

    console.log("Current Full Pathname:", currentPathname);
    console.log("Current Search Params:", urlParams.toString());

    const pathSegments = currentPathname.split('/');
    const currentFilename = pathSegments[pathSegments.length - 1]; 

    let cleanedCurrentFilename = currentFilename;
    if (cleanedCurrentFilename === '') {
        cleanedCurrentFilename = 'index.html';
    }

    console.log("Cleaned Current Filename for Comparison:", cleanedCurrentFilename);

    const currentCategory = urlParams.get('category');
    const currentSort = urlParams.get('sort');

    navLinks.forEach(link => {
        const linkUrl = new URL(link.href);
        const linkFilename = linkUrl.pathname.split('/').pop();
        const linkCategory = linkUrl.searchParams.get('category');
        const linkSort = linkUrl.searchParams.get('sort');

        console.log(`--- Checking link: ${link.href} (Filename: ${linkFilename}) ---`);

        let isActive = false;

        
        if (linkFilename === cleanedCurrentFilename) {

            if (!linkCategory && !linkSort) { 
                isActive = true;
                console.log(`Active (Simple Match): ${linkFilename}`);
            }
        }

        
        if (cleanedCurrentFilename === 'catalog.html' && linkFilename === 'catalog.html') {
            if (currentCategory === linkCategory && currentSort === linkSort) {
                isActive = true;
                console.log(`Active (Catalog Match): Category: ${linkCategory}, Sort: ${linkSort}`);
            } else if (!currentCategory && !currentSort && !linkCategory && !linkSort) {
                
                isActive = true;
                console.log(`Active (Catalog Base Match): No filters.`);
            } else if (!currentCategory && linkFilename === 'catalog.html' && !linkCategory) {
                
                isActive = true;
                console.log(`Active (All Products Link Match): ${linkFilename}`);
            }
        }
                
        if (linkCategory && currentCategory === linkCategory && cleanedCurrentFilename === 'catalog.html') {

            if (!linkSort) { 
                 isActive = true;
                 console.log(`Active (Category Nav Link Match): ${linkCategory}`);
            }
        }


        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
            console.log(`Not Active: ${link.href} - Filename mismatch.`); 
        }
    });
}