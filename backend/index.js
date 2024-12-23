const https = require("https");
const express = require("express");
const ngrok = require('ngrok');
const osc = require('osc');

// Configuration
require('dotenv').config()

var part = 1;

var codeList = [
  [
    "start-b.svg"
  ],
  [
    "m3f-r.svg",
    "syd-f.svg", "syd-n.svg", "syz-d.svg", "syz-u.svg",
    "v1p-b.svg", "v2p-b.svg", "v3p-b.svg", "v4p-b.svg",
    "v5p-b.svg", "v6p-b.svg", "v7p-b.svg", "v8p-b.svg"
  ],
  [
    "m3f-r.svg",
    "mc-d.svg", "mc-s.svg", "mc-u.svg",
    "pd-f.svg", "pd-n.svg",
    "syd-f.svg", "syd-n.svg", "syz-d.svg", "syz-u.svg",
    "v1p-b.svg", "v2p-b.svg", "v3p-b.svg", "v4p-b.svg",
    "v5p-b.svg", "v6p-b.svg", "v7p-b.svg", "v8p-b.svg"
  ],
  [
    "m3f-r.svg",
    "syd-f.svg", "syd-n.svg", "syz-d.svg", "syz-u.svg",
  ],
  [
    "v1p-b.svg", "v2p-b.svg", "v3p-b.svg", "v4p-b.svg",
    "v5p-b.svg", "v6p-b.svg", "v7p-b.svg", "v8p-b.svg"
  ],
];

const osc2barcode = {
  "/start": "start-b.svg",
  "/vocal/1/play bang": "v1p-b.svg",
  "/vocal/2/play bang": "v2p-b.svg",
  "/vocal/3/play bang": "v3p-b.svg",
  "/vocal/4/play bang": "v4p-b.svg",
  "/vocal/5/play bang": "v5p-b.svg",
  "/vocal/6/play bang": "v6p-b.svg",
  "/vocal/7/play bang": "v7p-b.svg",
  "/vocal/8/play bang": "v8p-b.svg",
  "/main/circling up":  "mc-u.svg",
  "/main/circling down": "mc-d.svg",
  "/main/circling steady": "mc-s.svg",
  "/mic3/filter random": "m3f-r.svg",
  "/percussion/d near": "pd-n.svg",
  "/percussion/d far": "pd-f.svg",
  "/synth/z up": "syz-u.svg",
  "/synth/z down": "syz-d.svg",
  "/synth/d near": "syd-n.svg",
  "/synth/d far": "syd-f.svg",
}

const removeItem = (array, valueToRemove) => {
  return array.filter(item => item !== valueToRemove);
};

var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: process.env.GROUND_OSC_PORT,
  metadata: true
});

udpPort.on("message", function (oscMsg, timeTag, info) {
  console.log("An OSC message just arrived!", oscMsg);

  switch (oscMsg.address) {
  case '/start/part':
    part = Number(oscMsg.args[0]['value']);
    break;
  case '/delete':
    codeList[part] = removeItem(codeList[part], osc2barcode[oscMsg.args[0]['value']])
    break;
  default:
    console.log(`Unknown Address`);
}
});

udpPort.open();

console.log(`OSC listening on port ${process.env.GROUND_OSC_PORT}!`);

const app = express();
const app_path = __dirname + '/../frontend/build';

const image_path = __dirname + '/images';

app.use("/", express.static(app_path));
app.use('/images', express.static(image_path));

app.get('/api/part', (req, res) => {
  res.json({ value: part });
});

app.get('/api/codelist', (req, res) => {
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
