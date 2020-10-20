var API = "4cdb51c7478b89bf7b7724ff2dd152db"
var weatherHistory = getHistory();

var search_btn = $(searchBtn);
var search_inp = $(searchInp);
var search_hist = $(searchHistory);
var forecast_el = $(forecastEl);


displayHistory()
search_btn.click(clickSearch)
$("#clear-history").on("click",clearHistory);

function getWeather(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API
    $.get(url)
        .then(function (response) {
            console.log(response)

            // Style main Card

            getUVI(response.coord)
        })
        .catch(function (error) {
            console.log(error.message)
        })
}

function getForecast(city) {
    var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API
    $.get(url)
        .then(function (response) {
            forecast_el.empty();
            for (var forecast of response.list) {
                if (!forecast.dt_txt.includes("12:00:00")) continue;
                console.log(forecast)

                var card = $("<div>")
                    .addClass('col')
                    .text(forecast.main.temp)
                // Style forecast card


                forecast_el.append(card)
            }
        })
        .catch(function (error) {
            console.log(error.message)
        })
}

function getUVI(coord) {
    var url = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + API
    $.get(url)
        .then(function (response) {
            // attach UVI to main card
            console.log(response)
        })
        .catch(function (error) {
            console.log(error.message)
        })
}

function displayHistory() {
    if (!weatherHistory.length) return;

    getWeather(weatherHistory[0]);
    getForecast(weatherHistory[0]);

    search_hist.empty();

    for (var city of weatherHistory) {
        var el = $("<li>")
            .addClass('list-group-item')
            .text(city)
            .click(clickHistory)

        search_hist.append(el)
    }
}

function clickHistory() {
    var city = $(this).text();
    updateHistory(city)
}

function clickSearch() {
    var city = search_inp.val();
    search_inp.val('');
    updateHistory(city)
}

function updateHistory(city) {
    if (weatherHistory.includes(city)) {
        var index = weatherHistory.indexOf(city);
        weatherHistory.splice(index, 1);
    };

    weatherHistory.unshift(city);
    setHistory();
    displayHistory();
}

function setHistory() {
    setLocal("weatherHistory", weatherHistory)
}
function getHistory() {
    return getLocal("weatherHistory") || [];
}
function setLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}
function getLocal(key) {
    return JSON.parse(localStorage.getItem(key))
}
function clearHistory(event){
    event.preventDefault();
    document.location.reload();

}