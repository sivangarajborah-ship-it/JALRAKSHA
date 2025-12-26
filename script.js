const WEATHER_API_KEY = "YOUR_API_KEY_HERE";

/* ---------- EXISTING FLOOD CHECK ---------- */
function checkFlood() {
  const location = document.getElementById("location").value.trim();
  if (!location) return alert("Enter location");

  const rainfall = Math.floor(Math.random() * 100);
  const riverLevel = Math.floor(Math.random() * 100);
  const alertIndex = Math.floor(Math.random() * 100);

  const riskScore = rainfall * 0.4 + riverLevel * 0.4 + alertIndex * 0.2;

  let risk, color, meter;
  if (riskScore < 30) { risk="🟢 LOW"; color="green"; meter="25%"; }
  else if (riskScore < 60) { risk="🟡 MODERATE"; color="orange"; meter="55%"; }
  else if (riskScore < 80) { risk="🔴 HIGH"; color="red"; meter="80%"; }
  else { risk="🚨 EXTREME"; color="darkred"; meter="100%"; }

  document.getElementById("riskTitle").innerText = risk;
  document.getElementById("meterFill").style.width = meter;
  document.getElementById("meterFill").style.background = color;

  document.getElementById("analysis").innerHTML = `
    <li>🌧 Rainfall Index: ${rainfall}</li>
    <li>🌊 River Level: ${riverLevel}%</li>
    <li>📢 Alert Index: ${alertIndex}</li>
    <li>📍 Location: ${location}</li>
  `;

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("details").classList.remove("hidden");
  document.getElementById("tips").classList.remove("hidden");
}

/* ---------- NEW: WEATHER API ---------- */
async function fetchLiveWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  );
  return await res.json();
}

/* ---------- GPS + LIVE WEATHER ---------- */
function getGPSLocation() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const data = await fetchLiveWeather(lat, lon);

    document.getElementById("gpsStatus").innerText = "✅ GPS Active";

    document.getElementById("analysis").innerHTML += `
      <li>🌧 Live Rainfall: ${data.rain?.["1h"] || 0} mm</li>
      <li>💧 Humidity: ${data.main.humidity}%</li>
      <li>📊 Pressure: ${data.main.pressure} hPa</li>
    `;

    document.getElementById("gpsMessage").value =
      `🚨 SOS ALERT\nhttps://maps.google.com/?q=${lat},${lon}`;
  });
}

/* ---------- EMERGENCY ---------- */
function emergencyMode() {
  document.getElementById("emergencyContacts").classList.remove("hidden");
}

function sendSOS() {
  if (confirm("Call emergency services?")) {
    window.location.href = "tel:112";
  }
}