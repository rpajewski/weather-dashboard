var cityInputEl = document.querySelector('#search-form');
var userFormEl = document.querySelector("#user-search");

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

var getCityWeather = function(city) {
    // format the github api url
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=26f877486e8bfd26e84f29be119ce7e6`;
  
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data, city);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather.com");
    });
};

userFormEl.addEventListener("submit", formSubmitHandler);