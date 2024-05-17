export function addSpinner(element) {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

function animateButton(element) {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("block");
    element.nextElementSibling.classList.toggle("none");
}

export function displayError(headerMsg, srMsg) {
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMsg);
}

function updateWeatherLocationHeader(message) {
    const h1 = document.getElementById("currentForecast_location");
    h1.textContent = message;
}

function updateScreenReaderConfirmation(message) {
    document.getElementById("confirmation").textContent = message;
}