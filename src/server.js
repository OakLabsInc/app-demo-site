
const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
const bodyParser = require('body-parser')
const axios = require('axios')
const request = require('request')
const QRCode = require('qrcode')
const fs = require('fs')
oak.catchErrors()

const express = require('express')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9001
const qrcodeJsonHost= process.env.QRCODE_HOST || `localhost`
const qrcodeJsonUrl = `http://${qrcodeJsonHost}:${process.env.QRCODE_PORT}/qrcode.json`
const printer = require(join(__dirname, 'print-receipt'))
const printerName = process.env.PRINTER_NAME || "http://localhost:631/printers/TM-T88V"

let publicPath = "/persistent"
let window = null
let service = null
app.use(bodyParser.json())
app.use(express.static(publicPath))

if(process.env.HOST_DOMAIN) {
  request(qrcodeJsonUrl, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    let remoteTouchpadUrl = body.machine.replace(/[0-9.]+:/i, `${process.env.HOST_DOMAIN}:`)
    console.log(body.machine.replace(/[0-9.]+:/i, `${process.env.HOST_DOMAIN}:`));
    QRCode.toFile(join("/persistent","qrcode.png"),remoteTouchpadUrl, {
      width: 111
    })
  
  });
}

let opts = {
  url: `http://localhost:${port}`,
  
  ontop: false,
  insecure: true,
  allowRunningInsecureContent: true,
  size: "1080x1920",
  sslExceptions: ['localhost'],
  background: '#000000',
  transparent: true,
  frame: false,
  scripts: [
    {
      name: "SwipeListener",
      path: join(__dirname, '..', 'node_modules', 'swipe-listener')
    }, 
    join(__dirname, 'public', 'js', 'menu_swipe.js'),
  ],
  flags: [
    "enable-vp8-alpha-playback",
    "disable-gpu",
    "enable-transparent-visuals"
  ]
}

app.listen(port, function () {
  oak.on('ready', () => loadWindow(opts))
})

app.get('/env', function(req, res) {
  let env = {...process.env}
  res.json(env)
})

app.get('/show', function(req, res) {
  window.show()
})

app.get('/hide', function(req, res) {
  window.hide()
})

app.get('/focus', function(req, res) {
  window.focus()
})
app.get('/close', function(req, res) {
  window.close()
})

app.post('/printer-attributes', async function(req, res) {
  let printers = await printer.getPrinterAttributes(printerName, function(name, ppd){
    res.json({
      message: "Sent To Printer",
      data: {
        ppd: ppd,
        name: name
      }
    })
  })
})

app.post('/print-receipt', async function(req, res) {
  console.log("Print request", req.body)
  req.body.service = service
  
  let receipt = await printer.printReceipt(printerName, req.body, function(data){
    res.json({
      message: "Receipt Sent To Printer",
      data: data
    })
  })
})
app.post('/set-site', function(req, res) { 
  // console.log(req.body)
  service = req.body
  process.env.SITE_NAME = service.siteName
  let appInfo = req.body.data
  publicPath = join("/persistent",service.environment.API_KEY,service.environment.DEMO_NAME, service.siteName)
 
  window.instance.loadURL(join(`http://localhost:${port}`,service.environment.API_KEY,service.environment.DEMO_NAME, service.siteName,"index.html"))
  //loadWindow(opts)
  window.focus()
 
  // console.log(opts)
  res.json({
    message: "Setting Application Url",
  })
})

app.post('/send-cart', function (req, res) {
  //console.log(req.body)
  let paymentPort = process.env.PAYMENT_PORT || 9002
  let paymentHost = process.env.PAYMENT_HOST || "localhost"
  let terminalIp = process.env.TERMINAL_IP || "192.168.86.245"
  let request = {
    "cart": {
      "total": req.body.subtotal.toString(),
      "taxRate": req.body.taxRate.toString(),
      "tax": req.body.tax.toString(),
      "grandTotal": req.body.total.toString()
    },
    "terminalIp": terminalIp
  }
  console.log(request)
  axios.post(`http://${paymentHost}:${paymentPort}`, request)
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log("payment-response: ", res)
      window.send('payment-response', res)
    })
    .catch(error => {
      console.error(error)
    })
  res.json({
    message: "Object Sent to payment component",
    cart: request
  })

  
})


function loadWindow (opts) {
  window = oak.load(opts)
  window.instance.setResizable(false)
  window.instance.webPreferences = {
    allowRunningInsecureContent: true
  }
  // console.log(window)
}
