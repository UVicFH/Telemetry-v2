import {PROTOCOL, LOCATION, PORT} from '../../shared/constants'
import http from 'http'
import tcpPortUsed from 'tcp-port-used'

const options = {
	host: '',
	path: '/data',
	port: `${PORT}`,
	method: 'POST',
	headers: {
    'Content-Type': 'application/json'
	}
}

const callback = function(response) {
	let str = ''
	response.on('data', function (chunk) {
		str = chunk
	})
	response.on('end', function () {
		console.log(`deposited ${str}`)
	})
}

let sec = 0

setInterval(function() {
	tcpPortUsed.check(PORT, 'localhost')
		.then(function(inUse) {
			console.log(`Port ${PORT} is now ${inUse ? 'in use' : 'free'}`)
			if (inUse) {
				const req = http.request(options, callback)
				req.write(JSON.stringify(
					[{
						'dataId': 'speed',
						'data': [sec*0.01]
					}]
				))
				req.end()
			}
		}, function(err) {
			console.error('Error on check:', err.message)
		})
	
	sec += 1
}, 3000)

