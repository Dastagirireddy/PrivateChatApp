var express = require('express'), // Loading Express server 
	app = express(), // Instantiating express  
	http = require('http').Server(app),
	socket = require('socket.io')(http, {log: true}),
	Room = require('./room.js'),
	uuid = require('node-uuid');

app.use(express.static(__dirname)); // To load the static files like html, css, and images,etc,...

http.listen(8080, function(data){
	console.log("Server is running on port 8080");
});

var people = {}; // This HashMap contains the people who are conncted to server socket

var rooms = {};

// Socket connection 
socket.on('connection', function(client){

	console.log(client.id);

	// Intialiizng client with username using "join" event
	client.on('join', function(name){

		var roomID = null;
		people[client.id] = {
			"name": name,
			"room": roomID
		};
		console.log(people);
		client.emit('update', "You have successfully conncted to the server");
		socket.emit('update-people', people);
	});

	// Wehenever uer connects to server socket, A room will be created for each and every user
	client.on('createRoom', function(name){

		if(people[client.id].room === null){

			var id = uuid.v4();
			var room = new Room(name, id, client.id);
			rooms[id] = room;
			client.room = name;
			client.join(client.room);
			room.addPerson(client.id);
			people[client.id].room = id;
			socket.sockets.emit('sendRoomsList', {'rooms': rooms});
		}
		else{
			socket.sockets.emit("update", "You have already created a room.");
		}
	});

	// Joined room id = RoomID
	client.on('joinedRoom', function(id){

		console.log("My Id is"+id);

		var room = rooms[id];
		console.log("-----------");
		console.log(rooms);
		if (client.id === room.owner) {

			client.emit("update", "You are the owner of this room and you have already been joined.");
		}
		else{

			var found = client.id in room.people; 

			if(found){
			
				client.emit('update', "You have already joined this room.");
			}
			else{

				room.addPerson(client.id);
				client.room = room.name;
				client.join(client.room);
				user = people[client.id];
      			socket.sockets.in(client.room).emit("update", user.name + " has connected to " + room.name + " room.");
      			client.emit("update", "Welcome to " + room.name + ".");
			}
		}
	});
	client.on("send", function(msg) {  
		
		// if (socket.sockets.manager.roomClients[client.id]['/'+client.room] !== undefined ) {
		
		// 	socket.sockets.in(client.room).emit("chat", people[client.id], msg);
		// } 
		// else {
			
		// 	client.emit("update", "Please connect to a room.");
		// }
		socket.sockets.in(client.room).emit("chat", people[client.id], msg);
	});	
});