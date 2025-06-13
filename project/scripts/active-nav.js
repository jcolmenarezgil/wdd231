// js/active-nav.js

/**
 * Marks the current page's link in the navigation as 'active'.
 * It compares the current window's pathname with the href of each navigation link.
 */
export function setActiveNavLink() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let currentFullPathname = window.location.pathname; 
    const currentSearchParams = window.location.search;

    console.log('Current Full Pathname:', currentFullPathname);
    console.log('Current Search Params:', currentSearchParams);

    const projectBase = '/project/'; 
    let cleanedCurrentPath = currentFullPathname;

    if (cleanedCurrentPath.startsWith(projectBase)) {
        cleanedCurrentPath = cleanedCurrentPath.substring(projectBase.length);
    }

    if (cleanedCurrentPath === '' || cleanedCurrentPath === '/') {
        cleanedCurrentPath = 'index.html';
    }

    console.log('Cleaned Current Path for Comparison:', cleanedCurrentPath);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        const linkFilename = linkHref.split('?')[0].split('/').pop();

        console.log(`--- Checking link: ${linkHref} (Filename: ${linkFilename}) ---`);

        if (cleanedCurrentPath === linkFilename) {

            if (linkFilename === 'catalog.html') {
                const linkUrl = new URL(link.href, window.location.origin);
                const currentUrl = new URL(window.location.href);

                const linkCategory = linkUrl.searchParams.get('category');
                const currentCategory = currentUrl.searchParams.get('category');

                console.log(`Catalog: Link Category: ${linkCategory}, Current Category: ${currentCategory}`);

                if (linkCategory && currentCategory && linkCategory === currentCategory) {
                    link.classList.add('active');
                    console.log(`Active: ${linkHref} - Matched category`);
                } else if (!linkCategory && !currentCategory) {
                    
                    link.classList.add('active');
                    console.log(`Active: ${linkHref} - Matched plain catalog`);
                }
                
            } else {
                
                link.classList.add('active');
                console.log(`Active: ${linkHref} - Matched filename`);
            }
        } else {
            console.log(`Not Active: ${linkHref} - Filename mismatch.`);
        }
    });
}