// Declare local variables 
var API = "4cdb51c7478b89bf7b7724ff2dd152db";
var weatherHistory = getHistory();
var search_btn = $("#searchBtn");
var search_inp = $("#searchInp");
var search_hist = $("#searchHistory");
var forecast_el = $("#forecastEl");
var clear_hist = $("#clear_Btn");
var current_weather = $("#currentWeatherEl");

// On page load and on clicks
displayHistory();
search_btn.click(clickSearch);
clear_hist.click(clearHistory);

//Function to display current weather 
function getWeather(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API;
    $.ajax(url)
        .then(function (response) {
            current_weather.empty();
            console.log(response);

        var city = response.name;
        var date = new Date(response.dt*1000).toLocaleDateString();    
        var icon = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
        var title = $("<h3>");

        title.text(city);
        current_weather.append(title);
        title.append(" ", "(", date, ")", "<img src="+iconURL+">");

        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        var pTemp = $("<p>");
        pTemp.text("Temperature: " + temp + "°F");
        current_weather.append(pTemp);

        var humidity = response.main.humidity;
        var phumidity = $("<p>");
        phumidity.text("Humidity: " + humidity + "%");
        current_weather.append(phumidity);

        var wind = response.wind.speed;
        var pwind = $("<p>");
        pwind.text("Wind Speed: " + wind + " MPH");
        current_weather.append(pwind);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + API;

        $.ajax(UVurl)
        .then(function (response) {
            var uvResponse = response.value;
            var UVI = $("<p>").addClass("card-text");
            UVI.text("UV Index: ");

            var btn = $("<span>").addClass(" btn btn-sm"). text(uvResponse);
            
                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }
            current_weather.append(UVI);
                // uvIndex.append(btn);
                $("#forecastEl card-body").append(UVI.append(btn));

        });

    })

        .catch(function (error) {
            console.log(error.message);
        });

}
// Function to display five day forecast
function getForecast(city) {
    var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API;
    $.get(url)
        .then(function (response) {
            forecast_el.empty();
            // forecast_el.html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").addClass("card");

            for (var forecast of response.list) {
                if (!forecast.dt_txt.includes("12:00:00")) continue;
                console.log(forecast);

                var forecastCol = $("<div>");
                var cardFive = $("<div>").addClass("card bg-primary text-white");
                var cardBodyFive = $("<div>").addClass("card-body p-1");

                var fiveDate = new Date(forecast.dt*1000).toLocaleDateString(); 
                var forecastTitle = $("<h4>").addClass("card-title");
                forecastTitle.text(fiveDate);
                // forecast_el.append(fiveTitle);

                var fiveIcon = forecast.weather[0].icon;
                var forecastIcon = "https://openweathermap.org/img/wn/"+ fiveIcon +"@2x.png";
                // forecast_el.append("<img src="+fiveIconURL+">")

                var fiveTemp = Math.round((forecast.main.temp - 273.15) * 1.80 + 32);
                var forecastTemp = $("<div>").addClass("card-text");
                forecastTemp.text("Temp: " + fiveTemp + "°F");
                // forecast_el.append(forecastTemp);

                var fiveHumidity = forecast.main.humidity;
                var forecastHumidity = $("<div>").addClass("card-text");
                forecastHumidity.text("Humidity: " + fiveHumidity + "%");
                // forecast_el.append(forecastHumidity);

                forecastCol.append(cardFive.append(cardBodyFive.append(forecastTitle, "<img src="+forecastIcon+">", forecastTemp, forecastHumidity)));
                // forecastCol.append(forecast_el(fiveDate, fiveTemp, fiveHumidity))
                forecast_el.append(forecastCol)
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
}
// Function that displays the search history on the side of the page
function displayHistory() {
    if (!weatherHistory.length) return;

    getWeather(weatherHistory[0]);
    getForecast(weatherHistory[0]);

    search_hist.empty();

    for (var city of weatherHistory) {
        var el = $("<li>")
            .addClass('list-group-item')
            .text(city)
            .click(clickHistory);

        search_hist.append(el);
    }
}
// Function that updates the search history
function clickHistory() {
    var city = $(this).text();
    updateHistory(city);
}
// Function that updates history when clicked
function clickSearch() {
    var city = search_inp.val();
    search_inp.val('');
    updateHistory(city);
}
// Function that sets the search history and connects the displayHistory function
function updateHistory(city) {
    if (weatherHistory.includes(city)) {
        var index = weatherHistory.indexOf(city);
        weatherHistory.splice(index, 1);
    }

    weatherHistory.unshift(city);
    setHistory();
    displayHistory();
}
// Sets history to local storage
function setHistory() {
    setLocal("weatherHistory", weatherHistory);
}
// Function to call on local storage
function getHistory() {
    return getLocal("weatherHistory") || [];
}
// Function to stringify items to local storage
function setLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// Function to get local storage and parse
function getLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}
// Function that clears the local storage
function clearHistory(event){
    event.preventDefault();
    localStorage.clear();


}