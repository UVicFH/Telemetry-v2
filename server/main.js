/*  #######################
 *  #      CONSTANTS      #
 *  #######################
 */
import {PORT, SERIALPORT, MODE} from '../shared/constants'

/*  #######################
 *  #       IMPORTS       #
 *  #######################
 */

import processCanMessage from './processCanMessage'
import express from 'express'
import bodyParser from 'body-parser'
import {SerialPort} from 'serialport'
import Datastore from 'nedb'

/*  #######################
 *  #     SERVER SETUP    #
 *  #######################
 */
// Create Express server
const app = express()
// Create HTTP server
const server = require('http').Server(app)      //reason for http server: http://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
// Bind websockets to HTTP server
const io = require('socket.io')(server)

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
	publicPath: webpackConfig.output.publicPath,
	stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false
		}
})

// Use webpack to build files in memory (to be served) todo: have alternate solution when I set up production builds
app.use(middleware)
app.use(webpackHotMiddleware(compiler))
app.use(bodyParser.json());

/*  #######################
 *  #      DATABASE       #
 *  #######################
 */
// Create DB
const db = new Datastore({ filename: './dataStore', autoload: true })

/*  #######################
 *  #     SERIALPORT      #
 *  #######################
 */
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
 *  #       ROUTING       #
 *  #######################
 */
// On websocket connection
io.on('connection', (socket) => {
	console.log('websocket connected')

	socket.emit('data', [
		{
			dataId: 'speed',
			data: [12]
		}
	])

	socket.on('disconnect', () => {
		console.log('websocket disconnected')
	})
})

// GET data
app.get('/data', function(req, res) {
	res.send(
		db.find({},
			function (err) {
				if (err) console.log(`db GET error: ${err}`) }))
})

// allow post requests if testing
if (MODE === 'dev') {
	// POST data
	app.post('/data', function(req, res) {
		console.log(req.body)
		db.insert(req.body, function (err, newDoc) {
			if (err) console.log(`db insert error: ${err}`)
			console.log(newDoc)
			io.emit('data', newDoc)
			res.send(newDoc)
		})
	})
}

// Server listens to requests on PORT
server.listen(PORT, function reportRunning() {
	console.log(`Running on port ${PORT}`)
})
