// script.js
const apiKey = "7d5e74e7b112e34001dc87b79a2fc7c3";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const forecastContainer = document.querySelector(".forecast-days");

async function checkWeather(city) {
    try {
        // Current weather
        const weatherResponse = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);
        
        if (weatherResponse.status === 404) {
            showError();
            return;
        }

        const weatherData = await weatherResponse.json();
        
        // 5-day forecast
        const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        
        updateCurrentWeather(weatherData);
        updateForecast(forecastData);
        
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".forecast").style.display = "block";
        document.querySelector(".error").style.display = "none";
    } catch (error) {
        showError();
    }
}

function updateCurrentWeather(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

    // Update weather icon using OpenWeatherMap's official icons
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

function updateForecast(data) {
    forecastContainer.innerHTML = "";
    const dailyData = data.list.filter((item, index) => index % 8 === 0);
    
    dailyData.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const forecastDay = document.createElement("div");
        forecastDay.className = "forecast-day";
        forecastDay.innerHTML = `
            <p>${date.toLocaleDateString("en-US", { weekday: "short" })}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(forecastDay);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            const data = await response.json();
            checkWeather(data.name);
        }, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showError() {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".forecast").style.display = "none";
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Initial call with default city
checkWeather("Anantapur");
