// Constants
var PATH = '/../public/';
var PORT = 3000;
var SERIALPORT = "/dev/tty.SLAB_USBtoUART";

// Create Express server
var express = require('express');
var app = express();

// Grab bootstrap middleware (serves css/js into accessible locaiton for frontend)
var bootstrap = require("express-bootstrap-service");

// Open serial port to Dorito (telemetry) chip
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort(SERIALPORT, {
    baudrate: 115200
});

// Server static files at PATH
app.use('/', express.static(__dirname + PATH));
// Load bootstrap middleware - mounts bootstrap css and js into accessible location for frontend
app.use(bootstrap.serve);

// Server listens to requests on PORT
app.listen(PORT, function reportRunning() {
    console.log('Running on port ' + PORT);
});

// On serial port open, print success message
serialPort.on('open', function() {
    console.log('Serial port open')
});

// On serial port receive data, process/save it
serialPort.on('data', function (data) {
    console.log('Data: ' + data);
});
