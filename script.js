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
            current_weather.empty();
            console.log(response)

        var city = response.name;
        var date = new Date(response.dt*1000).toLocaleDateString();    
        var icon = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
        var title = $("<h3>");

        title.text(city)
        current_weather.append(title)
        title.append(" ", "(", date, ")", "<img src="+iconURL+">")

        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        var pTemp = $("<p>")
        pTemp.text("Temperature: " + temp + "°F");
        current_weather.append(pTemp)

        var humidity = response.main.humidity;
        var phumidity = $("<p>")
        phumidity.text("Humidity: " + humidity + "%");
        current_weather.append(phumidity)

        var wind = response.wind.speed;
        var pwind = $("<p>")
        pwind.text("Wind Speed: " + wind + " MPH");
        current_weather.append(pwind)

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

                var fiveDate = new Date(forecast.dt*1000).toLocaleDateString(); 
                var fiveTitle = $("<card-title>")
                fiveTitle.text(fiveDate)
                forecast_el.append(fiveTitle)

                var fiveIcon = forecast.weather[0].icon;
                var fiveIconURL = "https://openweathermap.org/img/wn/"+ fiveIcon +"@2x.png";
                var forecastIcon = $("<img>")
                forecast_el.append("<img src="+fiveIconURL+">")

                var fiveTemp = Math.round((forecast.main.temp - 273.15) * 1.80 + 32);
                var forecastTemp = $("<div>")
                forecastTemp.text("Temp:" + fiveTemp)
                forecast_el.append(forecastTemp)

                var fiveHumidity = forecast.main.humidity;
                var forecastHumidity = $("<div>")
                forecastHumidity.text("Humidity: " + fiveHumidity)
                forecast_el.append(forecastHumidity)


            }
        })
        .catch(function (error) {
            console.log(error.message)
        })
}

function getUVI() {
             var lon = response.coord.lon;
            var lat = response.coord.lat;    
    
    var url = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + API
   
    
    $.ajax(url)
        .then(function (response) {



            var uvColor;
                var uvResponse = response.value;
                var uvIndex = $("<p>").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);


                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                current_weather.append(uvIndex.append(btn));

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
    localStorage.clear()


}