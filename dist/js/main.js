import { setLocationObject, getHomeLocation } from "./dataFunctions.js";
import { addSpinner, displayError } from "./domFunctions.js";
import CurrentLocation from "./currentLocation.js";

const currentLoc = new CurrentLocation();
function initApp() {
    // Add listeners
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);

    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);
    // Set up

    // Load weather
    loadWeather();
}

document.addEventListener("DOMContentLoaded", initApp);

function getGeoWeather(event) {
    if (event) {
        if (event.type === "click") {
            // add spinner
            const mapIcon = document.querySelector(".fa-map-marker-alt");
            addSpinner(mapIcon);
        }
    }

    if (!navigator.geolocation) {
        return geoError();
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function geoError(errorObj) {
    const errMsg = errorObj.message ? errorObj.message : "Geolocation not supported";
    displayError(errMsg, errMsg);
}

function geoSuccess(position) {
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };

    // Set location object
    setLocationObject(currentLoc, myCoordsObj);
    console.log(currentLoc);
    // Update data and display
    updateDataAndDisplay(currentLoc);
}

function loadWeather(event) {
    const savedLocation = getHomeLocation();
    if (!savedLocation && !event) {
        return getGeoWeather();
    }

    if (!savedLocation && event.type === "click") {
        displayError("No Home Location Saved.", "Sorry. Please save your home location first!");
    }
    else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    }
    else {
        const homeIcon = document.querySelector("fa-home");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
}

async function updateDataAndDisplay(locationObj) {
    // const weatherJson = await getWeatherFromCoords(locationObj);
    // if (weatherJson) {
    //     updateDisplay(weatherJson, locationObj);
    // }
}