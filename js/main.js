var apiKey = "3e60fc5f9af941e8810123717252906";

// Call weather on Enter key press
document.getElementById("cityInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

// Main function to get weather
async function getWeather(city) {
  var input = document.getElementById("cityInput");

  // If no city passed, use input field
  if (!city) {
    city = input.value.trim();
  }

  // If still no city, stop
  if (city === "") {
    alert("Enter City Name");
    return;
  }

  // Clear input after search
  input.value = "";

  // Show loader
  var loader = document.getElementById("loaderWrapper");
  loader.classList.remove("d-none");
  loader.classList.add("d-flex");

  // Clear previous results
  document.getElementById("forecastRow").innerHTML = "";
  document.getElementById("cityTitle").innerText = "";

  // API URL
  var url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4&aqi=no&alerts=no`;

  try {
    var response = await fetch(url);
    var data = await response.json();

    // Update city title
    document.getElementById("cityTitle").innerText =
      "Weather in " + data.location.name + ", " + data.location.country;

    // Loop through forecast
    var forecast = data.forecast.forecastday;
    var cartona = forecast
      .map(function (day, i) {
        var dateText = new Date(day.date).toDateString();
        var dayTitle = i === 0 ? "Today " + dateText : dateText;

        return `
        <div class="col-md-3">
          <div class="card shadow text-center bg-dark text-white border-0 rounded-4">
            <div class="card-body">
              <h5 class="card-title mb-3">${dayTitle}</h5>
              <img src="https:${day.day.condition.icon}" alt="icon">
              <p class="mt-2">${day.day.condition.text}</p>
              <p class="fs-5">
                <i class="fas fa-sun me-2 text-warning"></i>
                <strong>${day.day.avgtemp_c}°C</strong>
              </p>
              <p><i class="fas fa-tint me-2 text-info"></i>Humidity: ${day.day.avghumidity}%</p>
              <p><i class="fas fa-wind me-2 text-light"></i>Wind: ${day.day.maxwind_kph} kph</p>
            </div>
          </div>
        </div>`;
      })
      .join("");

    // Show results after short delay
    setTimeout(function () {
      document.getElementById("forecastRow").innerHTML = cartona;
      loader.classList.add("d-none");
      loader.classList.remove("d-flex");
    }, 200);
  } catch (error) {
    document.getElementById("forecastRow").innerHTML =
      '<p class="text-danger text-center">Error: City Not Found. Try again.</p>';

    loader.classList.add("d-none");
    loader.classList.remove("d-flex");
  }
}

// Auto-run on page load (with location if allowed)
window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      getWeather(lat + "," + lon);
    });
  } else {
    getWeather("Cairo");
  }
});
