const ipp = require('ipp');
const PDFDocument = require('pdfkit');
const concat = require("concat-stream")
const { join } = require('path')
const fs = require('fs')

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

let top = 10
let left = 20
let lineWidth = 260
let lineHeight = 20

function generateHr(doc) {
  doc.strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(left, top)
      .lineTo(lineWidth, top)
      .stroke()
  top += (lineHeight / 2)

}
function generateImage(doc, imageUrl, x) {
  doc.image(imageUrl, x, top, {width: x} )
  top += x
}

function itemLine(doc, name, price){
  let newPrice = formatCurrency(price)
  doc.text(name, left, top )
  doc.moveUp()
  doc.text(newPrice,{align:'right', width: (lineWidth - left)} )
  top += lineHeight
}
function formatCurrency(price) {
  let newPrice = parseFloat(price).toFixed(2).toString()
  return "$" + newPrice
}

async function printReceipt (printerName, data) {

  let doc = new PDFDocument({margin:0});
  let service = data.service
  let cart = data.cart
  let subtotal = data.subtotal
  let tax = data.tax
  let total = data.total

  let logoUrl = join("/persistent", service.environment.API_KEY, service.environment.DEMO_NAME, service.siteName, "images","printer-logo.png")
  let qrcodeUrl = join("/persistent", service.environment.API_KEY, service.environment.DEMO_NAME, service.siteName, "images","printer-qrcode.png")
  console.log(logoUrl, qrcodeUrl)

  generateImage(doc,logoUrl, 100)
  generateHr(doc)
  for(i in cart) {
    itemLine(doc, capitalize(cart[i].name) + " Pizza", cart[i].price)
    for(m in cart[i].modifiers) {
      itemLine(doc,"   " + capitalize(cart[i].modifiers[m].name) + " Extra", cart[i].modifiers[m].price)
    }
  }

  generateHr(doc)
  itemLine(doc, "Tax 8.6%", tax)
  itemLine(doc, "Total", total)

  generateImage(doc,qrcodeUrl, 100)

  doc.pipe(concat(function (data) {
    var printer = ipp.Printer(printerName);
    var msg = {
      "operation-attributes-tag": {
        "requesting-user-name": "Pizza Receipt",
        "job-name": "receipt.pdf",
        "document-format": "application/pdf"
      }
      , data: data
    };
    printer.execute("Print-Job", msg, function(err, res){
      console.log(err);
      console.log(res);
    });
  }));
  doc.end();
  //doc.pipe(fs.createWriteStream("receipt.pdf"));
}

async function getPrinterAttributes(name, cb) {
  var printer = ipp.Printer(name);
  printer.execute("Get-Printer-Attributes", null, function(err, res){
    if (err){
      cb(name, err)
    }
    cb(name, res)
  });
}



module.exports.printReceipt = printReceipt
module.exports.getPrinterAttributes = getPrinterAttributes