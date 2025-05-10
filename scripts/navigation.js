let icon = document.querySelector('#hamburgerMenu');
let menu = document.querySelector('#navigationList');

icon.addEventListener('click', function() {
    menu.classList.toggle('hidden');
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