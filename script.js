import {
    cityAddError,
    CityInputError,
    fetchError
} from "./errors.js"
import {
    format
} from "./node_modules/date-fns/esm/index.js"
import {
    API
} from "./api.js"
import {
    HTML_ELEMENTS
} from "./htmlElements.js"
import Cookies from "./node_modules/js-cookie/dist/js.cookie.mjs"
const favouriteCityList = []
renderCookies()

function updateApiData(cityName) {
    API.cityName = cityName
    API.url = `${API.serverUrl}?q=${API.cityName}&appid=${API.apiKey}`
}

function isCityNameCorrect(cityName) {
    return (isNaN(Number((cityName))) || cityName.length !== 0 || cityName.length < 18)
}

function getCityName() {
    const cityName = HTML_ELEMENTS.CITY_INPUT.value.trim()
    if (isCityNameCorrect()) {
        updateApiData(cityName)
    } else {
        throw new CityInputError("wrong city name given")
    }
}

function changeCityNames(times = 0) {
    if (times === HTML_ELEMENTS.CITY_NAMES.length) {
        return
    }
    HTML_ELEMENTS.CITY_NAMES[times].textContent = API.cityName
    return changeCityNames(times + 1)
}

function changeWeatherHtml(weather) {
    const kelvinDegrees = 273
    const toMiliseconds = 1000
    HTML_ELEMENTS.DEGREES_NUM.textContent = Math.round(Number(weather.main.temp) - kelvinDegrees)
    HTML_ELEMENTS.DETAIL_TEMPETURE.textContent = `Tempeture:  ${Math.round(Number(weather.main.temp) - kelvinDegrees)}°`
    HTML_ELEMENTS.FEELS_LIKE.textContent = `Feels like: ${Math.round(Number(weather.main.feels_like) - kelvinDegrees)}°`
    HTML_ELEMENTS.WEATHER.textContent = `Weather: ${weather.weather[0].main}`
    HTML_ELEMENTS.SUNRISE.textContent = `Sunrise: ${format(weather.sys.sunrise * toMiliseconds, "H")}:${format(weather.sys.sunrise * toMiliseconds, "mm")}`
    HTML_ELEMENTS.SUNSET.textContent = `Sunset: ${format(weather.sys.sunset * toMiliseconds, "H")}:${format(weather.sys.sunset * toMiliseconds, "mm")}`
    changeCityNames();
}

function sendRequest(event) {
    if(event){
        event.preventDefault()
    }
    try {
        getCityName();
    } catch (error) {
        alert(error)
    }

    const error = new fetchError("Fetch error.")
    fetch(API.url)
        .then((data) => {
            if (data.status !== 200) {
                throw new fetchError("Fetch error.")
            }
            data.json()
                .then(
                    function (data) {
                        changeWeatherHtml(data)
                    }
                )
        })
        .catch(() => alert(error))
}

function addToFavouriteCities() {
    if (favouriteCityList.includes(API.cityName)) {
        alert(new cityAddError(API.cityName))
        return;
    }
    if (favouriteCityList.length >= 7) {
        Cookies.remove(favouriteCityList.pop())
    }
    favouriteCityList.push(API.cityName)
    Cookies.set(API.cityName, API.cityName)
    renderFavoriteList()
}

function clearHtmlFavouriteList() {
    if (HTML_ELEMENTS.FAVORITE_LIST.childNodes.length === 0) {
        return
    }
    for (let item of HTML_ELEMENTS.FAVORITE_LIST.childNodes) {
        item.remove()
    }
    return clearHtmlFavouriteList()
}

function deleteFavoriteCity(city) {
    const cityName = city.textContent
    if (favouriteCityList.includes(cityName)) {
        favouriteCityList.splice(favouriteCityList.indexOf(cityName), 1)
        Cookies.remove(cityName)
        city.parentElement.remove()
    }
}


function renderFavoriteList() {
    clearHtmlFavouriteList()
    for (let item of favouriteCityList) {
        const city = document.createElement("li")
        city.textContent = item
        city.addEventListener("click", () => {
            showFavouriteCityWeather(item)
        })
        const container = document.createElement("div")
        container.className = "fav-container"
        const closer = document.createElement("div")
        closer.className = "closer"
        closer.textContent = "✕"
        closer.addEventListener("click", function () {
            deleteFavoriteCity(city)
        })
        HTML_ELEMENTS.FAVORITE_LIST.append(container)
        container.append(city)
        container.prepend(closer)
    }
}

function showFavouriteCityWeather(element) {
    HTML_ELEMENTS.CITY_INPUT.value = element
    sendRequest();
}

function renderCookies() {
    const cookies = Cookies.get()
    for (let item in cookies) {
        favouriteCityList.push(item)
    }
    renderFavoriteList()
}


HTML_ELEMENTS.FORECAST_FORM.addEventListener("submit", sendRequest)
HTML_ELEMENTS.HEART_ICON.addEventListener("click", addToFavouriteCities)