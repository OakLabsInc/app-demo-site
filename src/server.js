
const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
const bodyParser = require('body-parser')

oak.catchErrors()

const express = require('express')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9001
const printer = require(join(__dirname, 'print-receipt'))
const printerName = process.env.PRINTER_NAME || "http://localhost:631/printers/TM-T88V"

let publicPath = "/persistent"
let window = null
let service = null
app.use(bodyParser.json())
app.use(express.static(publicPath))

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


function loadWindow (opts) {
  window = oak.load(opts)
  window.instance.webPreferences = {
    allowRunningInsecureContent: true
  }
  // console.log(window)
}
