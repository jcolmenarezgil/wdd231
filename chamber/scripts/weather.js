// select HTML elements in the document
const currentTemp = document.querySelector('#weatherCurrent');
const tempMin = document.querySelector('#tempMin');
const tempMax = document.querySelector('#tempMax');
const humidity = document.querySelector('#humidity');
const weatherIcon = document.querySelector('#weatherIcon');
const captionDesc = document.querySelector('#weatherDescription');

let lat = '10.16';
let lon = '-67.99';
const apiKey = '47068ed1f1e29b78b3637411d7b69f6f';

const openweathermap = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

// fetch the weather data from the OpenWeatherMap API
async function apiFetch() {
    try {
        const response = await fetch(openweathermap);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

// display the weather data in the HTML document
function displayResults(weatherData) {
    currentTemp.innerHTML = `<p><b>${weatherData.main.temp.toFixed(2)}&deg; F</b></p>`;
    tempMax.innerHTML = `<p>High: ${weatherData.main.temp_max}&deg; F</p>`;
    tempMin.innerHTML = `<p>Low: ${weatherData.main.temp_min}&deg; F</p>`;
    humidity.innerHTML = `<p>Humidity: ${weatherData.main.humidity}%</p>`;
    weatherForecast.innerHTML = ``;

    const iconSrc = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const desc = weatherData.weather[0].description;
    weatherIcon.setAttribute('src', iconSrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.innerHTML = `<p>${desc}</p>`;
}

apiFetch();


const weatherForecast = document.querySelector('#weatherForecast');
const apiKeyForecast = 'a8afb468f80eae6e5ad5dcb12aa8c784';

const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKeyForecast}&units=imperial`;

async function apiFetchForecast() {
    try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayForecast(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
        weatherForecast.innerHTML = `<p>Error al cargar el pronóstico: ${error.message}</p>`;
    }
}

function displayForecast(weatherData) {
    const list = weatherData.list;
    const today = new Date();
    today.setHours(today.getHours(), 0, 0, 0); 

    let todayTemp = 'N/A';
    let tomorrowTemp = 'N/A';
    let dayAfterTomorrowTemp = 'N/A';

    let tomorrowName = 'Tomorrow';
    let dayAfterTomorrowName = 'After Tomorrow';

    const getDayName = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', timeZone: 'America/Caracas' }; 
        return date.toLocaleDateString('en-US', options);
    };

    for (let i = 0; i < list.length; i++) {
        const forecastDate = new Date(list[i].dt_txt + 'Z'); 
        const localForecastDate = new Date(forecastDate.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
        const forecastDay = new Date(localForecastDate.getFullYear(), localForecastDate.getMonth(), localForecastDate.getDate());
        const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (forecastDay.getTime() === currentDay.getTime()) {
            
            if (localForecastDate.getHours() >= today.getHours() && todayTemp === 'N/A') {
                 
                 todayTemp = list[i].main.temp;
            } else if (todayTemp === 'N/A' && i === list.length - 1) { 
                 todayTemp = list[i].main.temp;
            } else if (todayTemp === 'N/A' && (localForecastDate.getHours() < today.getHours() && i < list.length -1) && new Date(list[i+1].dt_txt + 'Z').toLocaleString('en-US', { timeZone: 'America/Caracas' }).split(' ')[1].split(':')[0] > today.getHours()){
                todayTemp = list[i].main.temp;
            }
        }

        const tomorrow = new Date(currentDay);
        tomorrow.setDate(currentDay.getDate() + 1);

        if (forecastDay.getTime() === tomorrow.getTime()) {
            if (tomorrowTemp === 'N/A') {
                tomorrowTemp = list[i].main.temp;
                tomorrowName = getDayName(list[i].dt_txt);
            }
        }

        const dayAfterTomorrow = new Date(currentDay);
        dayAfterTomorrow.setDate(currentDay.getDate() + 2);

        if (forecastDay.getTime() === dayAfterTomorrow.getTime()) {
            if (dayAfterTomorrowTemp === 'N/A') { 
                dayAfterTomorrowTemp = list[i].main.temp;
                dayAfterTomorrowName = getDayName(list[i].dt_txt);
            }
        }
    }

    let idealTodayTemp = 'N/A';
    let bestMatchIndex = -1;

    for (let i = 0; i < list.length; i++) {
        const forecastDate = new Date(list[i].dt_txt + 'Z');
        const localForecastDate = new Date(forecastDate.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
        const forecastDay = new Date(localForecastDate.getFullYear(), localForecastDate.getMonth(), localForecastDate.getDate());
        const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (forecastDay.getTime() === currentDay.getTime()) { 
            
            if (localForecastDate.getHours() <= today.getHours()) {
                bestMatchIndex = i; 
            } else if (bestMatchIndex === -1 && localForecastDate.getHours() > today.getHours()) {
                
                bestMatchIndex = i;
                break; 
            }
        }
    }

    if (bestMatchIndex !== -1) {
        idealTodayTemp = list[bestMatchIndex].main.temp;
    }


    weatherForecast.innerHTML = `
        <p class="tal"><b>Today:</b> ${idealTodayTemp}°F</p>
        <p class="tal"><b>${tomorrowName}</b>: ${tomorrowTemp}°F</p>
        <p class="tal"><b>${dayAfterTomorrowName}</b>: ${dayAfterTomorrowTemp}°F</p>
    `;
}

apiFetchForecast();