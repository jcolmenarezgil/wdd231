let icon = document.querySelector('#mainMenu');
let animated = document.querySelector('#navAnimation');

icon.addEventListener('click', function() {
    animated.classList.toggle('open');
    icon.classList.toggle('open');
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