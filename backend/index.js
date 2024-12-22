const https = require("https");
const express = require("express");
const ngrok = require('ngrok');

// Configuration
require('dotenv').config()

const app = express();
const app_path = __dirname + '/../frontend/build';

const image_path = __dirname + '/images';

app.use("/", express.static(app_path));
app.use('/images', express.static(image_path));

app.get('/api/image', (req, res) => {
  res.json({ imageUrl: `${process.env.HOST_URL}/images/fuck.jpg` });
});

(async function() {
  console.log("Initializing Ngrok tunnel...");

  // Initialize ngrok using auth token and hostname
  const url = await ngrok.connect({
    proto: "http",
    // Your authtoken if you want your hostname to be the same everytime
    authtoken: process.env.NGROK_AUTHTOKEN,
    // Your hostname if you want your hostname to be the same everytime
    hostname: process.env.NGROK_HOSTNAME,
    // Your app port
    addr: process.env.HOST_PORT,
  });

  console.log(`App listening on url ${url}`);
  console.log("Ngrok tunnel initialized!");
})();

app.listen(process.env.HOST_PORT, () => {
  console.log(`App listening on port ${process.env.HOST_PORT}!`);});
