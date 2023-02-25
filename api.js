export const API = {
    serverUrl: "http://api.openweathermap.org/data/2.5/weather",
    cityName: "Tokyo",
    apiKey: "d3cdffaa67091758b8f1186dc0cbf511"
}
API.url = `${API.serverUrl}?q=${API.cityName}&appid=${API.apiKey}`