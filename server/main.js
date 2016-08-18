/*  #######################
 *  #      CONSTANTS      #
 *  #######################
 */
import {PORT} from '../shared/constants'
// const SERIALPORT = '/dev/ttys001'
import {SERIALPORT, MODE} from '../shared/constants'

// Import CAN message handling
import processCanMessage from './processCanMessage'

// Create Express server
import express from 'express'
const app = express()
const server = require('http').Server(app)      //reason for http server: http://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen

/*  #######################
 *  #      SOCKET.IO      #
 *  #######################
 */
const io = require('socket.io')(server)

/*  #######################
 *  #      DATABASE       #
 *  #######################
 */
// Create DB
import Datastore from 'nedb'
const db = new Datastore({ filename: './dataStore', autoload: true })

/*  #######################
 *  #     SERIALPORT      #
 *  #######################
 */
import {SerialPort} from 'serialport'
// Open serial port to Dorito (telemetry) chip
if (MODE !== 'dev') {
	const serialPort = new SerialPort(SERIALPORT, {
		baudrate: 115200
	})

	// On serial port open, print success message
	serialPort.on('open', function () {
		console.log('Serial port open')
	})

	// On serial port receive data, process/save it
	serialPort.on('data', function (data) {
		db.insert(processCanMessage(data),
			function (err, newDoc) {
				if (err) console.log(`db insert error: ${err}`)
				console.log(newDoc)
				io.emit('data', newDoc)
			}
		)
	})
}

/*  #######################
 *  #       WEBPACK       #
 *  #######################
 */
import webpack from 'webpack'
import webpackConfig from '../webpack.config.js'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const compiler = webpack(webpackConfig)
const middleware = webpackMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath
})

// Use webpack to build files in memory (to be served) todo: have alternate solution when I set up production builds
app.use(middleware)
app.use(webpackHotMiddleware(compiler))

/*  #######################
 *  #       ROUTING       #
 *  #######################
 */

// On websocket connection
io.on('connection', (socket) => {
	console.log('websocket connected')

	socket.emit('data', { test: 'testData' })

	socket.on('disconnect', () => {
		console.log('websocket disconnected')
	})
})
// Get data
app.get('/data', function(req, res, err) {
	if (err) console.log(`data get error: ${err}`)
	res.send(
		db.find({},
			function (err) {
				if (err) console.log(`db get error: ${err}`) }))
})
// Server listens to requests on PORT
server.listen(PORT, function reportRunning() {
	console.log(`Running on port ${PORT}`)
})
