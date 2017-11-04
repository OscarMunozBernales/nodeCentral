var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require("socket.io").listen(server),
	mqtt = require('mqtt'),
	clientAlert = mqtt.connect({host:'192.168.251.3', port:1883})
	Sensor = require("./models/sensor").Sensor,
	document = require("min-document");

//Puerto donde corre el sistema
server.listen(8080);

//Ruteo a las paginas
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});
app.get('/chat', function(req, res) {
	res.sendFile(__dirname + '/views/chat.html');
});
app.get('/alert', function(req, res) {
	res.sendFile(__dirname + '/views/alert.html');
});

//Abre conexion con socket
io.sockets.on('connection', function(socket) {
	//Funciones cambiar alerta
	socket.on('sendAlert', function(data){
		var mensaje = "totem1/" + data.value;
		clientAlert.publish('alerta',mensaje);
	})
});
