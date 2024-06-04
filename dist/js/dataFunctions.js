export function setLocationObject(locationObj, coordsObj) {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) {
        locationObj.seUnit(unit);
    }
}

export function getHomeLocation() {
    return localStorage.getItem("defaultWeatherLocation");
}

export async function getWeatherFromCoords(locationObj) {
    const urlDataObj = {
        lat: locationObj.getLat(),
        lon: locationObj.getLon(),
        units: locationObj.getUnit()
    };

    try {
        const weatherStream = await fetch("./.netlify/functions/get_weather", {
            mathod: "POST",
            body: JSON.stringify(urlDataObj)
        });

        const weatherJson = await weatherStream.json();
        return weatherJson;
    } catch (error) {
        console.error(error);
    }
}

export async function getCoordsFromApi(entryText, units) {
    const urlDataObj = {
        text: entryText,
        units: units
    };

    try {
        const dataStrem = await fetch("./.netlify/functions/get_coords", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });

        const jsonData = await dataStrem.json();
        return jsonData;
    } catch (error) {
        console.error(error)
    }
}

export function cleanText(text) {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
}