// main.mjs
import { updateCurrentYear } from './datetimeyear.js';
import { setActiveNavLink } from './active-nav.js';

function main() {
    console.log("Hello Ucaima Import!");

    updateCurrentYear();
    setActiveNavLink();
    console.log("Main function executed.");
}

document.addEventListener("DOMContentLoaded", () => {
    main();
    console.log("Document is ready.");
});

