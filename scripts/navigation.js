let icon = document.querySelector('#hamburgerMenu');
let animated = document.querySelector('#animetedNavigation');

icon.addEventListener('click', function() {
    animated.classList.toggle('open');
})

/* Wayfinding */
let currentPage = window.location.pathname.split('/').pop();
let navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});