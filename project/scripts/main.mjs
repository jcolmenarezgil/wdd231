// main.mjs
import { updateCurrentYear } from './datetimeyear.js';

function main() {
    console.log("Hello Ucaima Import!");

    updateCurrentYear();
}

document.addEventListener("DOMContentLoaded", () => {
    main();
    console.log("Document is ready.");
});

