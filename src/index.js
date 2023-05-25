function formatDate(timestamp, dayRequest) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
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

function displayTemperature(response) {
  let cityElement = document.querySelector("#selectedCity");
  let temperatureElement = document.querySelector("#temperature");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#time");
  let dayElement = document.querySelector("#day");
  let date = response.data.dt * 1000;
  let iconElement = document.querySelector("#current-temperature-icon");
  let descriptionElement = document.querySelector("#description");

  celsiusTemperature = Math.round(response.data.main.temp);

  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  temperatureElement.innerHTML = celsiusTemperature;
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);

  dayElement.innerHTML = formatDate(date, true);
  timeElement.innerHTML = formatDate(date);

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function search(city) {
  let API_Key = "8e10c7fe5f766b36b0cbf765aac1cb61";
  let API_Url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`;
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
