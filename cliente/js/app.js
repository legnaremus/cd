var app = angular.module("monedero",['controllers','services','ngRoute']);

app.run(function(){
	console.log("app run");
});	
app.config(function($routeProvider){

	$routeProvider.when('/',{
		controller: 'mainCtrl',
		templateUrl: 'templates/login.html'
	})
	$routeProvider.when('/alertas',{
		controller: 'alertasCtrl',
		templateUrl: 'templates/alertas.html'
	})
	$routeProvider.when('/home',{
		controller: 'homeCtrl',
		templateUrl: 'templates/home.html'
	})
	$routeProvider.when('/altas',{
		controller: 'altasCtrl',
		templateUrl: 'templates/altas.html'
	})
	$routeProvider.when('/bajas',{
		controller: 'bajasCtrl',
		templateUrl: 'templates/bajas.html'
	})
	$routeProvider.when('/registros',{
		controller: 'registrosCtrl',
		templateUrl: 'templates/registros.html'
	})
	$routeProvider.when('/usuarios',{
		controller: 'usuariosCtrl',
		templateUrl: 'templates/usuarios.html'
	})
	$routeProvider.when('/sucursales',{
		controller: 'sucursalesCtrl',
		templateUrl: 'templates/sucursales.html'
	})
	$routeProvider.when('/promociones',{
		controller: 'promocionesCtrl',
		templateUrl: 'templates/promociones.html'
	})
	$routeProvider.when('/configuraciones',{
		controller: 'configuracionesCtrl',
		templateUrl: 'templates/configuraciones.html'
	})
	$routeProvider.when('/configuraciones/parametros',{
		controller: 'alertaCtrl',
		templateUrl: 'templates/parametros.html'
	})
	$routeProvider.when('/configuraciones/ticket',{
		controller: 'ticketCtrl',
		templateUrl: 'templates/ticket.html'
	})
	.otherwise('/');
});