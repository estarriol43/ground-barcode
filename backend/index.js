const https = require("https");
const express = require("express");
const ngrok = require('ngrok');
const osc = require('osc');

// Configuration
require('dotenv').config()

var part = 0;

var codeFreq = [
  {
    "start-b.svg": 1
  },
  {
    "m3f-r.svg" : 1,
    "syd-f.svg" : 1,
    "syd-n.svg" : 1,
    "syz-d.svg" : 1,
    "syz-u.svg" : 1,
    "v1p-b.svg" : 1,
    "v2p-b.svg" : 1,
    "v3p-b.svg" : 1,
    "v4p-b.svg" : 1,
    "v5p-b.svg" : 1,
    "v6p-b.svg" : 1,
    "v7p-b.svg" : 1,
    "v8p-b.svg" : 1,
  },
  {
    "m3f-r.svg" : 1,
    "mc-d.svg"  : 1,
    "mc-s.svg"  : 1,
    "mc-u.svg"  : 1,
    "pd-f.svg"  : 1,
    "pd-n.svg"  : 1,
    "syd-f.svg" : 1,
    "syd-n.svg" : 1,
    "syz-d.svg" : 1,
    "syz-u.svg" : 1,
    "v1p-b.svg" : 1,
    "v2p-b.svg" : 1,
    "v3p-b.svg" : 1,
    "v4p-b.svg" : 1,
    "v5p-b.svg" : 1,
    "v6p-b.svg" : 1,
    "v7p-b.svg" : 1,
    "v8p-b.svg" : 1,
  },
  {
    "m3f-r.svg" : 1,
    "syd-f.svg" : 1,
    "syd-n.svg" : 1,
    "syz-d.svg" : 1,
    "syz-u.svg" : 1,
  },
  {
    "v1p-b.svg" : 1,
    "v2p-b.svg" : 1,
    "v3p-b.svg" : 1,
    "v4p-b.svg" : 1,
    "v5p-b.svg" : 1,
    "v6p-b.svg" : 1,
    "v7p-b.svg" : 1,
    "v8p-b.svg" : 1,
  },
];

const osc2barcode = {
  "/start": "start-b.svg",
  "/start bang": "start-b.svg",
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
      delete codeFreq[part][osc2barcode[oscMsg.args[0]['value']]];
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
  res.json({ value: codeFreq[part] });
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
