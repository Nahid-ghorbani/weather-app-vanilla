function handleBackground(hour) {
  const bodyElement = document.body;

  if (hour >= 6 && hour < 18) {
    bodyElement.classList.remove("night");
    bodyElement.classList.add("day");
  } else {
    bodyElement.classList.remove("day");
    bodyElement.classList.add("night");
  }
}

function formatDate(timestamp, dayRequest) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  handleBackground(hour);

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (dayRequest) {
    return day;
  } else {
    return `${hour}:${minutes}`;
  }
}

function setForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  let weatherForecast = response.data.daily;

  weatherForecast.forEach(function (dailyForecast, index) {
    let day = setForecastDate(dailyForecast.time);

    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col forecast-col">
            <div class="forecast-day" id="forecast-day-1">
            ${day}
            </div>
            <img 
            src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              dailyForecast.condition.icon
            }.png" alt="${
          dailyForecast.condition.description
        }" class="forecast-icon" id="forecast-temperature-icon-1">
            <div class="forecast-temperature"> 
            <span>${Math.round(dailyForecast.temperature.minimum)}°</span>
             | 
             <span>${Math.round(dailyForecast.temperature.maximum)}°</span>
            </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let API_Key = "54cefcbff0e09o4f7ce00e50385cdat1";
  let API_Url = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${API_Key}&units=metric`;
  axios.get(API_Url).then(displayForecast);
}

function displayTemperature(response) {
  let cityElement = document.querySelector("#selectedCity");
  let temperatureElement = document.querySelector("#temperature");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#time");
  let dayElement = document.querySelector("#day");
  let date = response.data.time * 1000;
  let iconElement = document.querySelector("#current-temperature-icon");
  let descriptionElement = document.querySelector("#description");

  celsiusTemperature = Math.round(response.data.temperature.current);

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  temperatureElement.innerHTML = celsiusTemperature;
  humidityElement.innerHTML = Math.round(response.data.temperature.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);

  dayElement.innerHTML = formatDate(date, true);
  timeElement.innerHTML = formatDate(date);

  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function search(city) {
  let API_Key = "54cefcbff0e09o4f7ce00e50385cdat1";
  let API_Url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${API_Key}&units=metric`;
  axios.get(API_Url).then(displayTemperature);
}

function handleSubmit(submit) {
  submit.preventDefault();
  let cityInputElement = document.querySelector("#input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(click) {
  click.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = fahrenheitTemperature;
}

function displayCelsiusTemperature(click) {
  click.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;
}

let celsiusTemperature = null;
let formElement = document.querySelector("#form");
formElement.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheitTemperature");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsiusTemperature");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("london");
