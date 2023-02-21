import { CityInputError } from "./errors.js"
import { API } from "./api.js"
import { HTML_ELEMENTS } from "./htmlElements.js"
import { format } from "date-fns"
import { da } from "date-fns/locale"

HTML_ELEMENTS.CITY_INPUT.value = "Moscow"

function getCityName(){
    let cityName = HTML_ELEMENTS.CITY_INPUT.value.trim()
    if(!isNaN(Number((cityName))) || cityName.length === 0){
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
    HTML_ELEMENTS.SUNRISE.textContent = `Sunrise: ${format(weather.sys.sunrise*1000, 'H')}:${format(weather.sys.sunrise*1000, 'mm')}`
    HTML_ELEMENTS.SUNSET.textContent = `Sunset: ${format(weather.sys.sunset*1000, 'H')}:${format(weather.sys.sunset*1000, 'mm')}`

    changeCityNames();
}

function sendRequest(){
    getCityName();
    fetch(API.url)
    .catch((error) => {throw new error})
    .then((data) => {
        data.json()
        .then((data) => {changeWeatherHtml(data); console.log(data)})
    })
}
HTML_ELEMENTS.FORECAST_FORM.addEventListener('submit', function(event){event.preventDefault(); sendRequest()})