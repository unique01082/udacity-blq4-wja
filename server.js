// Require Express to run server and routes
const express = require("express");
// Require body-parser to parse request body
const bodyParser = require("body-parser");
const cors = require("cors");

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Start up an instance of app
const app = express();
const port = 3000;

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
app.get("/all", (req, res) => {
  res.send(projectData);
});

app.post("/submit", async (req, res) => {
  projectData = req.body ?? {};
  res.send(projectData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
