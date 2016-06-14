// var http = require('http');
var express = require('express');
var app = express();

var PATH = '/../public/';
var PORT = 3000;

app.use('/', express.static(__dirname + PATH));

app.listen(PORT, function reportRunning() {
    console.log('Running on port ' + PORT);
});
