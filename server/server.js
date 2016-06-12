// var http = require('http');
var express = require('express');
var app = express();

var PATH = '/../public/';
var PORT = 3000;

app.get('/', function (res, req, next) {

    var options = {
        root: __dirname + PATH,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    req.sendFile('index.html', options, function(err) {
        if (err) console.log('GET ERROR');
        else console.log('GET index');
    });
});

app.listen(PORT, function reportRunning() {
    console.log('Running on port ' + PORT);
});
