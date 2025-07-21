const API_KEY = "8c59fc25cdbade9a29d0957745f34863";

async function getWeatherAndTime() {
  const temperatureOutput = document.getElementById("temperature_output");
  const location = document.getElementById("input_location").value;
  if (!location) return console.warn("Please enter a location.");

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error("Location not found");

    const data = await response.json();

    // Extract weather info
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const city = data.name;
    const country = data.sys.country;

    // Calculate local time correctly
    const timezoneOffset = data.timezone; // in seconds
    const now = new Date();
    const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTimestamp + timezoneOffset * 1000);

    const hour = localTime.getHours();

    let gradient;

    if (hour >= 5 && hour < 9) {
        gradient = "linear-gradient(to right, #8360c3, #ffc371)";
    } else if (hour >= 9 && hour < 17) {
        gradient = "linear-gradient(to right, #56ccf2, #2f80ed)";
    } else if (hour >= 17 && hour < 20) {
        gradient = "linear-gradient(to right, #f2994a, #eb5757)";
    } else {
        gradient = "linear-gradient(to right, #0f2027, #203a43, #2c5364)";
    }

    // ✅ Apply gradient to #main_div
    const mainDiv = document.getElementById("main_div");
    mainDiv.style.background = gradient;
    mainDiv.style.borderImageSlice = 1;

    // ✅ Set weather icon in #main_icon
    const weatherIconOutput = document.getElementById("main_icon");
    const weatherMain = data.weather[0].main.toLowerCase();
    const isDayTime = hour >= 6 && hour < 18;

    let iconHTML = "";

    if (weatherMain === "clear") {
      iconHTML = isDayTime
        ? `<i class="fa-solid fa-sun  fa-3x" style="color: #FFD43B;"></i>`
        : `<i class="fa-solid fa-moon fa-2xl " style="color: #99dbc7;"></i>`;
    } else if (weatherMain === "clouds") {
      iconHTML = `<i class="fa-solid fa-cloud fa-2xl" style="color: #788191;"></i>`;
    } else if (weatherMain === "rain" || weatherMain === "drizzle") {
      iconHTML = `<i class="fa-solid fa-cloud-rain fa-2xl" style="color: #929bab;"></i>`;
    } else if (weatherMain === "thunderstorm") {
      iconHTML = `<i class="fa-solid fa-cloud-bolt fa-2xl" style="color: #79859a;"></i>`;
    } else {
      // fallback if unrecognized condition
      iconHTML = `<i class="fa-solid fa-question-circle fa-2xl" style="color: #ccc;"></i>`;
    }

    weatherIconOutput.innerHTML = iconHTML;

    // ✅ Temperature output
    temperatureOutput.innerHTML = `<i class="fa-solid fa-temperature-three-quarters fa-2x" style="color: #d1d1d1;"></i> <span id="temp_number"> ${temp}°C </span>`;

    // ✅ Console log
    console.log(`🌍 Location: ${city}, ${country}`);
    console.log(`🌡️ Temperature: ${temp}°C`);
    console.log(`☁️ Weather: ${description}`);
    console.log(`🕒 Local Time: ${localTime.toLocaleString()}`);

  } catch (err) {
    console.error("❌ Error:", err.message);
    temperatureOutput.innerHTML = "Error fetching weather data.";
  }
}


//8c59fc25cdbade9a29d0957745f34863