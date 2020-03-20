
const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
const bodyParser = require('body-parser')

oak.catchErrors()

const express = require('express')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9001


let publicPath = join(__dirname, 'public')
let window = null
app.use(bodyParser.json())
app.use(express.static(publicPath))

let opts = {
  url: `http://www.meimeiboston.com/`,
  ontop: false,
  insecure: true,
  flags: ['enable-vp8-alpha-playback'],
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
  ]
}

app.listen(port, function () {
  oak.on('ready', () => loadWindow(opts))
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

app.post('/set-site', function(req, res) {
  // console.log(req.body)
  let service = req.body
  let appInfo = req.body.data

  window.instance.loadURL(join("file:///","persistent",service.environment.API_KEY,service.environment.DEMO_NAME, service.siteName, "index.html"))
  //loadWindow(opts)
  window.focus()
 
  // console.log(opts)
  res.json({
    message: "Setting Application Url",
  })
})


function loadWindow (opts) {
  window = oak.load(opts)
  // console.log(window)
}
