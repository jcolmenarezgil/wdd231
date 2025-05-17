let year = document.querySelector('#currentyear');
let date = new Date();
let currentYear = date.getFullYear();
year.innerHTML = currentYear;

let update = document.querySelector('#lastUpdated');
let lastUpdated = new Date(document.lastModified);
let lastUpdatedDate = lastUpdated.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
update.innerHTML = lastUpdatedDate;