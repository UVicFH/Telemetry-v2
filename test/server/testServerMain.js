import {PROTOCOL, LOCATION, PORT} from '../../shared/constants'
import http from 'http'

const options = {
	host: '',
	path: '/data',
	port: `${PORT}`,
	method: 'POST',
	headers: {
    'Content-Type': 'application/json'
	}
};

const callback = function(response) {
	let str = ''
	response.on('data', function (chunk) {
		str = chunk;
	});
	response.on('end', function () {
		console.log(`deposited ${str}`)
	});
}

let sec = 0

setInterval(function() {
	const req = http.request(options, callback)

	req.write(
		JSON.stringify(
			[
				{
						"dataId": "speed",
						"data": [sec]
				}
			]
		)
	);
	req.end()
	sec += 1
}, 3000)
