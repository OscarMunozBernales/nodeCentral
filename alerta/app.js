var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require("socket.io").listen(server),
	mqtt = require('mqtt'),
	clientAlert = mqtt.connect({host:'192.168.251.3', port:1883})
	Sensor = require("./models/sensor").Sensor,
	document = require("min-document");

//generar el schema para cargar a la db
client.on('message', function(topic, message) {
	splitMessage = message.toString().split("/");
	//Schema sensores
	var sensor = new Sensor({
		paramSensor: String(topic),
		dato: String(splitMessage[1]),
		idTotem: String(splitMessage[0]),
		fechaYHora: Date()
	});

	//Guardar en la db los datos.
	sensor.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("los datos fueron cargados a la db " + sensor.paramSensor);
		}
	})

	//Condicional para ejecutar la funcion correspondiente a cada dashboard
	if(topic=="temperatura"){
		io.sockets.emit('new temperatura', {
			value: String(splitMessage[1])
		});
		console.log("Emitio el mensaje a new temperatura");
	}

});

//Puerto donde corre el sistema
server.listen(80);

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
		console.log("se envio el dato por mqtt: " + data.value);
	})
});
