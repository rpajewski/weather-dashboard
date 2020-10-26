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


// place weather on screen
var displayWeather = function(weather) {
    // check if api found cities weather
    if (!weather) {
        activeCityEl.textContent = "No City Found.";
        return;
    }

    console.log(weather);
    // get long & lat for UV Index pull
    var lon = weather.city.coord.lon;
    var lat = weather.city.coord.lat;
    fetch (
        `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=26f877486e8bfd26e84f29be119ce7e6`
    )
    // set current uvIndex to use later
    .then(function(response) {
        response.json().then(function(data) {
            currentUvIndex = data[0].value;
        })
    })

    // timeout to make sure uvIndex returns before trying to place it
    setTimeout(function tick() {
        // place current cities weather on top

        // banner city variables
        var cityName = weather.city.name;
        var icon = weather.list[0].weather[0].icon;
        var temp = weather.list[0].main.temp;
        var humid = weather.list[0].main.humidity;
        var wind = weather.list[0].wind.speed;
        var uvIndex = currentUvIndex;
        var weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

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

        // if, else if and else to set classes based on uv index rating
        if (uvIndex < 3) {
            uvIndexEl.removeAttribute('class', 'uv-index-orange');
            uvIndexEl.removeAttribute('class', 'uv-index-red');
            uvIndexEl.setAttribute('class', 'uv-index-green');
        }
        else if (uvIndex < 7 && uvIndex > 3) {
            uvIndexEl.removeAttribute('class', 'uv-index-green');
            uvIndexEl.removeAttribute('class', 'uv-index-red');
            uvIndexEl.setAttribute('class', 'uv-index-orange');
        }
        else {
            uvIndexEl.removeAttribute('class', 'uv-index-orange');
            uvIndexEl.removeAttribute('class', 'uv-index-green');
            uvIndexEl.setAttribute('class', 'uv-index-red');
        }

        // add new city to list
        searchHistory(weather);

        forecastContainerEl.textContent = '';

        // loop over weather for 5 day forecast
        for (var i = 0; i < weather.list.length; i++) {
            if (weather.list[i].dt_txt.indexOf('12:00:00') !== -1) {
                // variables for 5 day forecast
                var forecastIcon = weather.list[i].weather[0].icon;
                var forecastTemp = weather.list[i].main.temp;
                var forecastHumid = weather.list[i].main.humidity;
                var forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
                
                // create forecast containers
                dayEl = document.createElement('div');
                dayEl.className = 'day';

                // add day to currentTime and establish new date for 5 day forecast
                dd++;
                currentTime = `${mm}/${dd}/${yyyy}`;
                forecastDay = document.createElement('h3');
                forecastDay.textContent = currentTime;
                dayEl.appendChild(forecastDay);

                forecastIconEl = document.createElement('img');
                forecastIconEl.setAttribute('src', forecastIconUrl);
                forecastIconEl.className = 'icon';
                dayEl.appendChild(forecastIconEl);

                forecastTempEl = document.createElement('p');
                forecastTempEl.innerHTML = `Temp: ${forecastTemp} °F`;
                dayEl.appendChild(forecastTempEl);

                dayEl.appendChild(document.createElement('br'));

                forecastHumidEl = document.createElement('p');
                forecastHumidEl.innerHTML = `Humidity: ${forecastHumid}%`;
                dayEl.appendChild(forecastHumidEl);

                forecastContainerEl.appendChild(dayEl);
            }
        }
    }, 500);
};

var searchHistory = function(weather) {
    var cityHistory = weather.city.name;
    // create and append searched city
    listCityEl = document.createElement('li');
    listCityEl.textContent = cityHistory;
    listCityEl.setAttribute('class', 'listed-cities');
    cityListEl.appendChild(listCityEl);

    // make history clickable
    listCityEl.addEventListener('click', function() {
        getCityWeather(cityHistory);
    })

    // save to local storage
    localStorage.setItem('key', cityHistory);
};

// search city based on user feedback
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