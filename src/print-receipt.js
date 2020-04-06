const ipp = require('ipp');
const PDFDocument = require('pdfkit');
const concat = require("concat-stream");


async function printReceipt (printerName) {

  var doc = new PDFDocument({margin:0});
  
  doc.text("############################################", 0, 0);
  doc.text('Hello world!', 50, 50)
  doc.text('Hello world again!')
  doc.text("############################################", 0, 0);

  

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