var cityInputEl = document.querySelector('#search-form');
var userFormEl = document.querySelector("#user-search");
var activeCityEl = document.querySelector('#active-city');
var cityListEl = document.querySelector('#cities');
var tempEl = document.querySelector('#temp');
var humidityEl = document.querySelector('#humidity');
var windEl = document.querySelector('#wind-speed');
var uvIndexEl = document.querySelector('#uv-index');
var forecastContainerEl = document.querySelector('#forecast-container');


// submit button handler
var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        getCityWeather(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
};

var displayWeather = function(weather) {
    // check if api found cities weather
    if (!weather) {
        activeCityEl.textContent = "No City Found.";
        return;
    }

    console.log(weather);

    var lon = weather.city.coord.lon;
    var lat = weather.city.coord.lat;
    fetch (
        `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=26f877486e8bfd26e84f29be119ce7e6`
    )
    .then(function(response) {
        response.json().then(function(data) {
            currentUvIndex = data[0].value;
        })
    })

    setTimeout(function tick() {
        // place current cities weather on top
        var cityName = weather.city.name;
        var icon = weather.list[0].weather[0].icon;
        var temp = weather.list[0].main.temp;
        var humid = weather.list[0].main.humidity;
        var wind = weather.list[0].wind.speed;
        var uvIndex = currentUvIndex;
        var weatherIconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        // get current day
        var currentTime = new Date();
        var dd = String(currentTime.getDate()).padStart(2, '0');
        var mm = String(currentTime.getMonth() + 1).padStart(2, '0');
        var yyyy = currentTime.getFullYear();

        currentTime = `${mm}/${dd}/${yyyy}`;

        // place elements on screen
        iconEl = document.createElement('img');
        iconEl.setAttribute('src', weatherIconUrl);
        iconEl.className = 'icon';
        
        activeCityEl.innerHTML = "";
        activeCityEl.innerHTML = `${cityName}  ${currentTime} `;
        activeCityEl.appendChild(iconEl);

        tempEl.innerHTML = "";
        tempEl.innerHTML = `${temp} °F`;

        humidityEl.innerHTML = "";
        humidityEl.innerHTML = `${humid}%`;

        windEl.innerHTML = "";
        windEl.innerHTML = `${wind} MPH`;

        uvIndexEl.textContent = "";
        uvIndexEl.textContent = uvIndex;

        // add new city to list
        listCityEl = document.createElement('li');
        listCityEl.textContent = cityName;
        listCityEl.setAttribute('class', 'listed-cities');
        cityListEl.appendChild(listCityEl);

        // loop over weather for 5 day forecast
        for (var i = 0; i < weather.length; i + 8) {
            var forecastDate = weather.list[i].dt_txt;
            var forecastIcon = weather.list[i].weather[i].icon;
            var forecastTemp = weather.list[i].main.temp;
            var forecastHumid = weather.list[i].main.humidity;
            var forecastIconUrl = `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
            
            // create forecast containers
            dayEl = document.createElement('div');
            dayEl.className = 'day';

            forecastDay = document.createElement('h3');
            forecastDay.textContent = forecastDate;
            dayEl.appendChild(forecastDay);

            forecastIconEl = document.createElement('img');
            forecastIconEl.setAttribute('src', forecastIconUrl);
            forecastIconEl.className = 'icon';
            dayEl.appendChild(forecastIconEl);

            forecastTempEl = document.createElement('p');
            forecastTempEl.innerHTML = `Temp: ${forecastTemp} °F`;
            dayEl.appendChild(forecastTempEl);

            forecastHumidEl = document.createElement('p');
            forecastHumidEl.innerHTML = `Humidity: ${forecastHumid}%`;
            dayEl.appendChild(forecastHumidEl);

            forecastContainerEl.appendChild(dayEl);
        }
    }, 500);
};

var getCityWeather = function(city) {
    // format the openweather api url
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=26f877486e8bfd26e84f29be119ce7e6`;
  
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    // place weather on screen
                    displayWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            // alert if there is an issue pulling weather
            alert("Unable to connect to OpenWeather.com");
    });
};

userFormEl.addEventListener("submit", formSubmitHandler);