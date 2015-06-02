var app = angular.module('myPrivateChatApp', ['socket-io']);

app.controller('PrivatechatController', function($scope, socket){

	console.log("I am in PrivatechatController");
	// Scope declarations
	$scope.username = '';
	$scope.usersList = '';
	$scope.rooms = '';
	$scope.room = '';
	$scope.roomId = '';
	$scope.message = '';

	// Socket Incoming connectins from server
	socket.on('update', function(client){

		console.log(client);
	});
	socket.on('update-people', function(clients){

		//console.log(clients);
		$scope.usersList = clients;
		//console.log($scope.usersList);
		$scope.users = clients;
		console.log($scope.users);
	});	
	socket.on('sendRoomsList', function(rooms){

		$scope.rooms = rooms;
		console.log($scope.rooms);
	});
	socket.on('chat', function(message){

		console.log(message);
	});
	// Connecting to socket host
	var socket = io.connect("http://localhost:8080");
	$scope.setUser = function(){
		

		console.log($scope.usersList);
		socket.emit('join', $scope.username);
		console.log($scope.username);
		//alert("hiii");
		$scope.username = '';
	};

	$scope.setRoom = function(){

		socket.emit('createRoom', $scope.room);
		$scope.room = '';
	};
	$scope.setJoinRoom = function(){

		socket.emit('joinedRoom', $scope.roomId);
	};
	$scope.sendMessage = function(){

		socket.emit('send', $scope.message);
	};
});

app.directive('onlineUser', function(){

	return {
		restrict: 'E',
		replace: true,
		scope: {

		},
		link: function($scope, element, attributes){

			$scope.username = attributes.username;
		},
		template: '<div class="online-user"><span class="pull-left">{{username}}</span><span class="pull-right online-status"></span></div>'
	}
});