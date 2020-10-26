# Weather Dashboard

## Description:
App using OpenWeatherMap API to get data based on user search. The app will pull from OpenWeatherMaps API based on the city name and then display the weather accordingly. 

The displayWeather function uses the API data to gather longitude and latitude for the searched city then feeds that information back into another API call to gather the UV Index. Onces the app has gathered all necessary information from OpenWeatherMap it will begin placing in on the screen accordingly. 

UV Index is styled based on severity of UV score. 

For loop interates over a 5 day forecast by grabbing data at a 12:00:00 time index to remain consistent. 

## Link to Deployed Project:
https://rpajewski.github.io/weather-dashboard/

## Screenshot of Project:
![Screen Shot 2020-10-11 at 2 35 54 PM](https://user-images.githubusercontent.com/70237837/95688335-1d248300-0bcf-11eb-9852-fa04de3d19d1.png)
