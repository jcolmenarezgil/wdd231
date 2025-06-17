// scripts/navigation.js

/**
 * Initializes the hamburger menu functionality.
 * Toggles the visibility of the main navigation using a single CSS class for animation.
 */
export function initializeHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hambuger-menu');
    const mainNav = document.querySelector('header nav');

    if (!hamburgerMenu || !mainNav) {
        console.warn('Hamburger menu or main navigation not found. Menu animation not initialized.');
        return;
    }

    mainNav.classList.remove('menu-open');
    mainNav.classList.remove('menu-closing'); 


    hamburgerMenu.addEventListener('click', () => {
        if (!mainNav.classList.contains('menu-open')) {
            
            mainNav.offsetHeight;

            mainNav.classList.add('menu-open');

        } else {

            mainNav.classList.remove('menu-open');

            mainNav.addEventListener('transitionend', function handler() {

                if (!mainNav.classList.contains('menu-open')) {
                    
                }
                mainNav.removeEventListener('transitionend', handler);
            }, { once: true });
        }
    });

    window.addEventListener('resize', () => {
        const desktopBreakpoint = 768; 

        if (window.innerWidth >= desktopBreakpoint) {

            mainNav.classList.remove('menu-open');
            mainNav.style.display = '';
        }
    });

    
    if (window.innerWidth >= 768) {
        mainNav.classList.remove('menu-open');
        mainNav.style.display = ''; 
    } else {
        /* mainNav.style.display = 'none'; */
    }
}