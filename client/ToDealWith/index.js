var http = require('http')

var data = []

console.log('started index')

var config = [
	{
		'name': 'speedGraph',
		'options': [
			{'dbId': 'speed'},
			{'xAxis': 'time'},
			{'yAxis': 'speed'}
		]
	}
]

function onTick() {

	return http.get({
		host: 'localhost',
		path: '/email'
	}, function(response) {
		// Continuously update stream with data
		var body = ''
		response.on('data', function(d) {
			body += d
		})
		response.on('end', function() {

			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body)
			callback({
				email: parsed.email,
				password: parsed.pass
			})
		})
	})
}