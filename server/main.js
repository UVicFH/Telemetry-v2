/*  #######################
 *  #      CONSTANTS      #
 *  #######################
 */
const PATH_CLIENT = '/../client/'
const PORT = 3000
// const SERIALPORT = '/dev/ttys001'
const SERIALPORT = '/dev/tty.SLAB_USBtoUART'

// Import CAN message handling
const processCanMessage = require('./processCanMessage')

// Create Express server
const express = require('express'),
	app = express()

/*  #######################
 *  #      DATABASE       #
 *  #######################
 */
// Create DB
const Datastore = require('nedb'),
	db = new Datastore({ filename: 'dataStore', autoload: true })

/*  #######################
 *  #     SERIALPORT      #
 *  #######################
 */
// Open serial port to Dorito (telemetry) chip
const SerialPort = require('serialport').SerialPort,
	serialPort = new SerialPort(SERIALPORT, {       //change back to SERIALPORT when chip is plugged in
		baudrate: 115200
	})

// On serial port open, print success message
serialPort.on('open', function() {
	console.log('Serial port open')
})

// On serial port receive data, process/save it
serialPort.on('data', function (data) {
	db.insert(processCanMessage(data), function (err) { console.log('db insert error') })
})

/*  #######################
 *  #      BOOTSTRAP      #
 *  #######################
 */
// Grab bootstrap middleware (serves css/js into accessible locaiton for frontend)
const bootstrap = require('express-bootstrap-service')

// Load bootstrap middleware - mounts bootstrap css and js into accessible location for frontend
app.use(bootstrap.serve)

/*  #######################
 *  #       WEBPACK       #
 *  #######################
 */
const webpack = require('webpack')
const webpackConfig = require('../webpack.config.js')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compiler = webpack(webpackConfig)
const middleware = webpackMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath
})

app.use(middleware)
app.use(webpackHotMiddleware(compiler))

/*  #######################
 *  #       ROUTING       #
 *  #######################
 */
// Server static files at PATH
app.use('/', express.static(__dirname + PATH_CLIENT))
// Get data
app.get('/data', function(req, res, err) {
	if (err) { console.log('data get error') }
	res.send(db.find({}, function (err) { console.log('db get error') }))
})
// Server listens to requests on PORT
app.listen(PORT, function reportRunning() {
	console.log('Running on port ' + PORT)
})
