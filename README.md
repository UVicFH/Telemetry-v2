# Telemetry-v2
New Telemetry system using node 6.x.x

## Setup
* Dorito shaped telemetry chip
* [Drivers](https://www.silabs.com/products/mcu/Pages/USBtoUARTBridgeVCPDrivers.aspx)
* Node v6.x.x (and NVM if you need more than one version of node on your computer)
* NPM
* [SerialPort setup](https://github.com/EmergingTechnologyAdvisors/node-serialport/blob/3.1.2/README.md)

## Start
* use `npm start`

## Dev
The Telemetry-v2 is separated into two distinct parts, the server and the client.  
For those who are new to web development, the back-end typically covers data storage and the server which delivers it, while the front-end covers everything that ends up on the client's (user's) web browser. In our particular case, we don't have anything else running on the back-end since our node server handles the routing, data storage (inserting and finding), serial port access, and websocket communication. So from here out, I'll refer to our back-end as simply the server, and front-end as the client.


## Notes

* Look into production mode (for react-bootstrap): https://github.com/react-bootstrap/react-bootstrap/issues/2101

## Todos

* Include docs for why http server is used with express [here](http://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen)
* Setup SCSS loading
