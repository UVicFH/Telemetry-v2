// Constants
var PATH = '/../public/';
var PORT = 3000;
var SERIALPORT = '/dev/tty.SLAB_USBtoUART';

// Import CAN message handling
var processCanMessage = require('./processCanMessage');

// Create Express server
var express = require('express'),
    app = express();

// Open serial port to Dorito (telemetry) chip
var SerialPort = require('serialport').SerialPort,
    serialPort = new SerialPort(SERIALPORT, {       //change back to SERIALPORT when chip is plugged in
    baudrate: 115200
});

// Create DB
var Datastore = require('nedb'),
    db = new Datastore({ filename: 'dataStore', autoload: true });

// Grab bootstrap middleware (serves css/js into accessible locaiton for frontend)
var bootstrap = require('express-bootstrap-service');

// Server static files at PATH
app.get('/', express.static(__dirname + PATH));
// Get data
app.get('/data', function(req, res, err) {
    if (err) { console.log('data get error') }
    res.send(db.find({}, function (err) { console.log('db get error') }));
});

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
    db.insert(processCanMessage(data), function (err) { console.log('db insert error') });
});
