var API = "4cdb51c7478b89bf7b7724ff2dd152db"
var weatherHistory = getHistory();

var search_btn = $(searchBtn);
var search_inp = $(searchInp);
var search_hist = $(searchHistory);
var forecast_el = $("#forecastEl");
var clear_hist = $(clear_Btn);
var current_weather = $("#currentWeatherEl");


displayHistory();
search_btn.click(clickSearch);
clear_hist.click(clearHistory);

function getWeather(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API
    $.ajax(url)
        .then(function (response) {
            console.log(response)


            
        var city = response.name;
        var Hcity = $("<h3>")
        Hcity.text(city)

        var date = new Date(response.dt*1000).toLocaleDateString();
        // city.append(date)


        var icon = response.weather[0].icon
        var iconURL = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";



        current_weather.append(Hcity, date, "<img src="+iconURL+">")
        console.log(city)


        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        var pTemp = $("<p>")
        pTemp.text("Temperature: " + temp + "°F");
        current_weather.append(pTemp)
        console.log(temp)

        var humidity = response.main.humidity;
        var phumidity = $("<p>")
        phumidity.text("Humidity: " + humidity + "%");
        current_weather.append(phumidity)
        console.log(humidity)

        var wind = response.wind.speed;
        var pwind = $("<p>")
        pwind.text("Wind Speed: " + wind + " MPH");
        current_weather.append(pwind)
        console.log(wind)

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

                // var date = $("#h3")
                // .addClass("card")
                // .text((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();

                var fiveTemp = $("<div>")
                    .addClass('card')
                    .text("Temp: " + Math.round((forecast.main.temp - 273.15) * 1.80 + 32) + "°F")
                    forecast_el.append(fiveTemp)

                // Style forecast card


                    // var card2 = $("<div")
                    // .text("Humidity: " + (forecast.main.humidity) + "%")
                    // forecast_el.append(card2)                
                // var card2 = $("<div")
                // .addClass("col")
                // .text(forecast.main.humidity + "%")


            }
        })
        .catch(function (error) {
            console.log(error.message)
        })
}

function getUVI(coord) {
    var url = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + API
    $.ajax(url)
        .then(function (response) {

            var lon = data.coord.lon;
            var lat = data.coord.lat;

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