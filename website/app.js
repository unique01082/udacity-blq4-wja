/* Global Variables */
const DEFAULT_UNIT = "imperial";
const apiKey = "923fe800aca046b69819c7c974ad2e28";
const button = document.getElementById("generate");
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

/**
 * Handle submit event
 */
const handleSubmit = async () => {
  try {
    // Get zip value
    const zipValue = zip.value;

    // Get weather from openweathermap
    const data = await fetchData({ zip: zipValue });

    // Get feelings value
    const feelingsValue = feelings.value;

    // Send data to server
    await sendData({
      zip: zipValue,
      feel: feelingsValue,
      date: newDate,
      temp: data.main.temp,
    });

    // Fetch newest data and re-render UI
    await retrieveData();
  } catch (error) {
    alert(error.message);
  }
};

/**
 * Send data to server
 * @param {object} payload
 * @returns
 */
const sendData = (payload) =>
  fetch("/submit", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

/**
 * Get most recent entry from server
 */
const retrieveData = async () => {
  const request = await fetch("/all");
  // Transform into JSON
  const allData = await request.json();
  // Write updated data to DOM elements
  updateUI(allData);
};

/**
 * Update UI base on data
 * @param {object} data
 */
const updateUI = (data) => {
  if (Object.keys(data).length) {
    document.getElementById("temp").innerHTML =
      Math.round(data.temp) + " degrees";
    document.getElementById("content").innerHTML = data.feel;
    document.getElementById("date").innerHTML = data.date;
    document.getElementById("zipcode").innerHTML = data.zip;
  }
};

/**
 *
 * @param {*} params
 * @returns
 */
const fetchData = async (params = {}) => {
  // Build endpoint string with parameters
  let url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.append("units", DEFAULT_UNIT);
  url.searchParams.append("appId", apiKey);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  // Send request
  const response = await fetch(url);
  // Parse response
  const data = await response.json();

  // Check if response succeeded
  if (data?.cod !== 200) {
    throw new Error(data?.message);
  }

  return data;
};

// Fetch most recent entry from server on
window.addEventListener("load", retrieveData);

// Add event listener for button
button.addEventListener("click", handleSubmit);
