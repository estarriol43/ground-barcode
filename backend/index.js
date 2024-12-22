const https = require("https");
const express = require("express");
const ngrok = require('ngrok');
const osc = require('osc');

// Configuration
require('dotenv').config()

var part = 0;

var codeList = [
  [],
  ['1', '2', '3'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['9', '10', '11']
];

var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: process.env.LOCAL_OSC_PORT,
  metadata: true
});

udpPort.on("message", function (oscMsg, timeTag, info) {
  console.log("An OSC message just arrived!", oscMsg);
  console.log(oscMsg.address)

  switch (oscMsg.address) {
  case '/start/part':
    part = Number(oscMsg.args[0]['value']);
    break;
  default:
    console.log(`Unknown Address`);
}
});

udpPort.open();

console.log(`OSC listening on port ${process.env.LOCAL_OSC_PORT}!`);

const app = express();
const app_path = __dirname + '/../frontend/build';

const image_path = __dirname + '/images';

app.use("/", express.static(app_path));
app.use('/images', express.static(image_path));

app.get('/api/part', (req, res) => {
  res.json({ value: part });
});

app.get('/api/codelist', (req, res) => {
  console.log(`GET /api/codelist`)
  res.json({ value: codeList[part] });
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
