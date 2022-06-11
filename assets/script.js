var searchButton = $(`#searchButton`)
var APIKey = `c5cb87d9095e41665509b06d9f73e089`
var currentWeather = document.getElementById(`currentWeather`)
var futureCards = document.getElementById("futureCards")
var cityArray = JSON.parse(localStorage.getItem("city")) || []
var pastCities = document.getElementById(`pastCities`)

function displayPastCities () {
    cityArray.forEach(element => {
        if (pastCities.textContent.includes(element)) {
            pastCities.innerHTML += ""
        } else (pastCities.innerHTML += `<button onclick="recallWeather(this.textContent)" type="button" class="btn btn-primary">${element}</button>`)
    });
}    


function fetchWeather() {
    // get coordinates of city searched
    var city = document.getElementById(`citySearch`).value
    futureCards.innerHTML = ""
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=` + city + `&appid=` + APIKey +`&units=imperial`)
    .then((response) => {
        if (!response.ok) {
            alert("No city found.");
            throw new Error("No city found.");
        }
        return response.json();
        })
        // use coordinates to get data from One Call
        .then((cityData) => {
            console.log(cityData)
            var lon = cityData.coord.lon
            var lat = cityData.coord.lat
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`)
            .then((response) => {
                return response.json();
                })
                // set weather data as variables and save city to local storage
                .then((data) => {
                    console.log(data)
                    var cityName = cityData.name
                    var weatherIcon = data.current.weather[0].icon
                    var temperature = data.current.temp.toFixed(1)
                    var wind = data.current.wind_speed.toFixed(1)
                    var humidity = data.current.humidity
                    var UV = data.current.uvi.toFixed(2)
                    if (!cityArray.includes(cityName)) {
                        pastCities.innerHTML += `<button onclick="recallWeather(this.textContent)" type="button" class="btn btn-primary cityButton">${cityName}</button>`
                    }
                    cityArray.push(cityName)
                    localStorage.setItem("city", JSON.stringify(cityArray));
                   
                    // Generate current weather
                    displayForecast(cityName, weatherIcon, temperature, wind, humidity, UV, data);
                    UVcolor()
                }                    
            )    
        }
    )
}

function recallWeather(clickedText) {
    // get coordinates of previously searched city
    recallCity = clickedText
    futureCards.innerHTML = ""
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=` + recallCity + `&appid=` + APIKey +`&units=imperial`)
    .then((response) => {
        if (!response.ok) {
            alert("No city found.");
            throw new Error("No city found.");
        }
        return response.json();
        })
        // use coordinates to get data from One Call
        .then((cityData) => {
            console.log(cityData)
            var lon = cityData.coord.lon
            var lat = cityData.coord.lat
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`)
            .then((response) => {
                return response.json();
                })
                // set weather data as variables and save city to local storage
                .then((data) => {
                    console.log(data)
                    var cityName = cityData.name
                    var weatherIcon = data.current.weather[0].icon
                    var temperature = data.current.temp.toFixed(1)
                    var wind = data.current.wind_speed.toFixed(1)
                    var humidity = data.current.humidity
                    var UV = data.current.uvi
                    
                    // Generate current weather
                    displayForecast(cityName, weatherIcon, temperature, wind, humidity, UV, data);
                    UVcolor()
                }                                    
            )    
        }
    )
}
    

function displayForecast (cityName, weatherIcon, temperature, wind, humidity, UV, data) {
    currentWeather.innerHTML = 
                        `<div id="cityHeader">
                            <h2 id="currentCity" aria-placeholder="currentCity">${cityName}</h2>
                            <img src= "https://openweathermap.org/img/wn/`+ weatherIcon +`.png" alt="" class="icon" />
                        </div>
                        <p>Temp: ${temperature}&degF</p>
                        <p>Wind: ${wind} mph</p>
                        <p>Humidity: ${humidity}%</p>
                        <div id="UVdiv">                
                            <p>UV Index:</p>
                            <p id="UVvalue" name="${UV}">${UV}</p>
                        </div>`
                    
                    // Generate the 5-day forecast
                    for(var i=0; i<5; i++) {
                    var dailyDate = dayjs().add(i+1,`day`).format(`MM/DD/YY`)
                    var dailyIcon = data.daily[i].weather[0].icon
                    var dailyMaxTemp = data.daily[i].temp.max.toFixed(0)
                    var dailyMinTemp = data.daily[i].temp.min.toFixed(0)
                    var dailyWind = data.daily[i].wind_speed.toFixed(0)
                    var dailyHumidity = data.daily[i].humidity
                    futureCards.innerHTML += `
                    <div class="card col">
                        <div>
                            <h4>${dailyDate}</h4>
                            <img src="https://openweathermap.org/img/wn/${dailyIcon}.png" alt="" class="icon" />
                        </div>
                        <p>Temp: ${dailyMinTemp}-${dailyMaxTemp}&degF</p>
                        <p>Wind: ${dailyWind} mph</p>
                        <p>Humidity: ${dailyHumidity}%</p>
                    </div>`;
}}


displayPastCities ()

function UVcolor () {
    var UVvalue = document.getElementById("UVvalue")
    var displayedUV = parseInt(UVvalue.getAttribute("name"))
    if(displayedUV<=2) {
        UVvalue.classList.add("green")
    } else if (displayedUV>2 && displayedUV<6) {
        UVvalue.classList.add("yellow")
    } else if (displayedUV>=6 && displayedUV<8){
        UVvalue.classList.add("orange")
    } else if (displayedUV>=8 && displayedUV<11){
        UVvalue.classList.add("red")
    } else UVvalue.classList.add("purple")
    }


searchButton.click(fetchWeather)