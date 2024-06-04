import {
    setLocationObject,
    getHomeLocation,
    getWeatherFromCoords,
    getCoordsFromApi,
    cleanText
} from "./dataFunctions.js";

import {
    setPlaceholderText,
    addSpinner,
    displayError,
    displayApiError,
    updateScreenReaderConfirmation,
    updateDisplay
} from "./domFunctions.js";

import CurrentLocation from "./currentLocation.js";

const currentLoc = new CurrentLocation();

function initApp() {
    // add listeners
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);
    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);
    const saveButton = document.getElementById("saveLocation");
    saveButton.addEventListener("click", saveLocation);
    const unitButton = document.getElementById("unit");
    unitButton.addEventListener("click", setUnitPref);
    const refreshButton = document.getElementById("refresh");
    refreshButton.addEventListener("click", refreshWeather);
    const locationEntry = document.getElementById("searchBar_form");
    locationEntry.addEventListener("submit", submitNewLocation);
    // set up
    setPlaceholderText();
    // load weather
    loadWeather();
}

document.addEventListener("DOMContentLoaded", initApp);

function getGeoWeather(event) {
    if (event && event.type === "click") {
        const mapIcon = document.querySelector(".fa-map-marker-alt");
        addSpinner(mapIcon);
    }

    if (!navigator.geolocation) {
        return geoError();
    }
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function geoError(errObj) {
    const errMsg = errObj ? errObj.message : "Geolocation not supported";
    displayError(errMsg, errMsg);
}

function geoSuccess(position) {
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };

    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
}

function loadWeather(event) {
    const savedLocation = getHomeLocation();

    if (!savedLocation && !event) {
        return getGeoWeather();
    }

    if (!savedLocation && event.type === "click") {
        displayError("No Home Location Saved.", "Sorry. Please save your home location first.");
    }
    else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    }
    else {
        const homeIcon = document.querySelector(".fa-home");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
}

function displayHomeLocationWeather(home) {
    if (typeof home === "string") {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit
        };

        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplay(currentLoc);
    }
}

function saveLocation() {
    if (currentLoc, getLat() && currentLoc.getLon()) {
        const saveIcon = document.querySelector(".fa-save");
        addSpinner(saveIcon);

        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        };

        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location.`);
    }
}

function setUnitPref() {
    const unitIcon = document.querySelector(".fa-chart-bar");
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc);
}

function refreshWeather() {
    const refreshIcon = document.querySelector(".fa-sync-alt");
    addSpinner(refreshIcon);
    updateDataAndDisplay(currentLoc);
}

async function submitNewLocation(event) {
    event.preventDefault();

    const text = document.getElementById("searchBar_text").value;
    const entryText = cleanText(text);

    if (!entryText.length) {
        return;
    }

    const locationIcon = document.querySelector(".fa-search");
    addSpinner(locationIcon);

    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());

    if (coordsData) {
        if (coordsData.cod === 200) {
            const myCoordsObj = {
                lat: coordsData.coords.lat,
                lon: coordsData.coords.lon,
                name: coordsData.sys.country
                    ? `${coordsData.name}, ${coordsData.sys.country}`
                    : coordsData.name
            };

            setLocationObject(currentLoc, myCoordsObj);
            updateDataAndDisplay(currentLoc);
        }
        else {
            displayApiError(coordsData);
        }
    }
    else {
        displayError("Connection Error", "Connection Error");
    }
}

async function updateDataAndDisplay(locationObj) {
    const weatherJson = await getWeatherFromCoords(locationObj);
    if (weatherJson) {
        updateDisplay(weatherJson, locationObj);
    }
}