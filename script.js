import { cityAddError, CityInputError, fetchError } from "./errors.js"
import { format } from "./node_modules/date-fns/esm/index.js"
import { API } from "./api.js"
import { HTML_ELEMENTS } from "./htmlElements.js"
import Cookies from "./node_modules/js-cookie/dist/js.cookie.mjs"
const favouriteCityList = []
renderCookies()

function getCityName(){
    let cityName = HTML_ELEMENTS.CITY_INPUT.value.trim()
    if(!isNaN(Number((cityName))) || cityName.length === 0 || cityName.length >= 18){
        throw new CityInputError("wrong city name given")
    }
    API.cityName = cityName
    API.url = `${API.serverUrl}?q=${API.cityName}&appid=${API.apiKey}`
}

function changeCityNames(times = 0){
    if(times === HTML_ELEMENTS.CITY_NAMES.length){return}
    HTML_ELEMENTS.CITY_NAMES[times].textContent = API.cityName
    return changeCityNames(times + 1)
}

function changeWeatherHtml(weather){
    HTML_ELEMENTS.DEGREES_NUM.textContent = Math.round(Number(weather.main.temp) - 273)
    HTML_ELEMENTS.DETAIL_TEMPETURE.textContent = `Tempeture: ${Math.round(Number(weather.main.temp) - 273)}`
    HTML_ELEMENTS.FEELS_LIKE.textContent = `Feels like: ${Math.round(Number(weather.main.feels_like) - 273)}`
    HTML_ELEMENTS.WEATHER.textContent = `Weather: ${weather.weather[0].main}`
    HTML_ELEMENTS.SUNRISE.textContent = `Sunrise: ${format(weather.sys.sunrise*1000, "H")}:${format(weather.sys.sunrise*1000, "mm")}`
    HTML_ELEMENTS.SUNSET.textContent = `Sunset: ${format(weather.sys.sunset*1000, "H")}:${format(weather.sys.sunset*1000, "mm")}`
    changeCityNames();
}
function sendRequest(){
    getCityName();
    fetch(API.url)
    .catch(() => {throw new fetchError("Fetch error.")})
    .then((data) => {
        if(data.status !== 200){
            throw new fetchError("Fetch error.")
        }
        data.json()
        .then((data) => {changeWeatherHtml(data)})
    })
}

function addToFavouriteCities(){
    fetch(API.url)
    .catch(() => {throw new fetchError("City add error.")})
    .then(() => {
        if(favouriteCityList.includes(API.cityName)){
            throw new cityAddError(API.cityName)
        }
        if(favouriteCityList.length >= 7){
            Cookies.remove(favouriteCityList.pop())
        }
        favouriteCityList.push(API.cityName)
        Cookies.set(API.cityName,API.cityName)
        renderFavoriteList()
    })
}

function clearHtmlFavouriteList(){
    if(HTML_ELEMENTS.FAVORITE_LIST.childNodes.length === 0){
        return
    }
    for(let item of HTML_ELEMENTS.FAVORITE_LIST.childNodes){
        item.remove()
    }
    return clearHtmlFavouriteList()
}

function deleteFavoriteCity(city){
    let cityName = city.textContent
    if(favouriteCityList.includes(cityName)){
        favouriteCityList.splice(favouriteCityList.indexOf(cityName), 1)
        Cookies.remove(cityName)
        city.parentElement.remove()
    }

}
  

function renderFavoriteList(){
    clearHtmlFavouriteList()
    for(let item of favouriteCityList){
        let city = document.createElement("li")
        city.textContent = item
        city.addEventListener("click", () => {showFavouriteCityWeather(item)})
        let container = document.createElement("div")
        container.className = "fav-container"
        let closer = document.createElement("div")
        closer.className = "closer"
        closer.textContent = "✕"
        closer.addEventListener("click",function(){deleteFavoriteCity(city)})
        HTML_ELEMENTS.FAVORITE_LIST.append(container)
        container.append(city)
        container.prepend(closer)
    }
}

function showFavouriteCityWeather(element){
    HTML_ELEMENTS.CITY_INPUT.value = element
    sendRequest();
}

function renderCookies(){
    let cookies = Cookies.get()
    for(let item in cookies){
        favouriteCityList.push(item)
    }
    renderFavoriteList()
}

HTML_ELEMENTS.FORECAST_FORM.addEventListener("submit", function(event){event.preventDefault(); sendRequest();})
HTML_ELEMENTS.HEART_ICON.addEventListener("click", function(){addToFavouriteCities()})