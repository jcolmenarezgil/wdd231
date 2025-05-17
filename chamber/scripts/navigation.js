let icon = document.querySelector('#mainMenu');
let animated = document.querySelector('#navAnimation');

icon.addEventListener('click', function() {
    animated.classList.toggle('open');
    icon.classList.toggle('open');
})

/* Wayfinding */
let currentPage = window.location.pathname.split('/').pop();
let navLinks = document.querySelectorAll('#navAnimation ul li a');
console.log("Current Page:", currentPage);
navLinks.forEach(link => {
    console.log("Link href:", link.getAttribute('href'));
    if (link.getAttribute('href') === currentPage) {
        console.log("Match found for:", link);
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});