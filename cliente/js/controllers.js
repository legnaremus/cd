
var app = angular.module("controllers",['ngRoute']);

app.controller('alertasCtrl',function($scope,servidor,$window){

	$scope.alertas = [];

	$scope.get_alertas = function(){

		servidor.get_alertas(function(response){
			$scope.alertas = [];

			for (i = 0; i < response.data.length;i++){
				response.data[i].fecha_transaccion = new Date(response.data[i].fecha_transaccion).toLocaleString()
				response.data[i].estado = false;
				$scope.alertas.push(response.data[i]);
			}

		});		
	};
	$scope.get_alertas();

	$scope.activa = function(){
		var ids = '';

		for (i = 0; i < $scope.alertas.length;i++){
			if ($scope.alertas[i].estado){
				ids += $scope.alertas[i].id_monedero + ",";
			}
		}

		servidor.activa(ids,$scope.password,function(response){
			$scope.message_ok = null;
			$scope.message_error = null;

			console.log(response);

			switch(response.status){
				case 402:
					$scope.message_error = "Contraseña incorrecta";
					break;
				case 200:
					$scope.message_ok = "Cambios guardados";
					$scope.get_alertas();
					$window.location = "#/home";
					
					break;
			};
		});
	};
});

app.controller('mainCtrl',function($scope,servidor,token,$window){
	$scope.message_error = "";


	$scope.login = function(){
		$scope.error_login = false;
		$scope.message_error = "";

		servidor.login($scope.user,$scope.password,function(response){
			console.log(response);
			var token_o = {};
			token_o.user = $scope.user;

			switch (response.status){
				case 401:
					$scope.error_login = true;
					$scope.message_error = "Datos incorrectos";
					break;
				case 200:
					token_o.token = response.data;
					token.set_token(token_o);
					console.log(token.get_token());
					$window.location = "#/home";
					$window.location.reload();
					break;
			}
		});
	}
});
app.controller('ticketCtrl',function($scope,servidor,token) {

	$scope.obten_ticket = function(){
		servidor.obten_ticket(function(response){
			console.log(response);
			if (response.data[0].ticket == 1){
				$scope.ticket = true;
			}else{
				$scope.ticket = false;
			}
		});
	};

	$scope.guarda_ticket = function(){
		var val = 0;
		if ($scope.ticket) val = 1;

		servidor.establece_ticket(val,function(response){
			console.log(response);
		});
	}

	$scope.obten_ticket();

});
app.controller('sucursalesCtrl',function($scope,servidor,token) {
	$scope.sucursal = {};
	$scope.sucursal_editando = {};
	$scope.sucursal_editando_status = false;
	$scope.contrasenia = '';

	$scope.sucursales = [];

	$scope.cancelar = function(){
		$scope.sucursal_editando_status = false;

	}

	$scope.guardar_cambios = function(){
		$scope.message_ok = null;
		$scope.message_error = null;

		if ($scope.contrasenia == ''){
			$scope.message_error = 'Escriba su contrasenia';
			return;
		}
		servidor.modifica_sucursal($scope.sucursal_editando,$scope.contrasenia,function(response){
			switch(response.status){
				case 200:
					$scope.message_ok = 'Sucursal modificada correctamente';
					$scope.obten_sucursales();
					$scope.sucursal_editando = {};
					$scope.sucursal_editando_status = false;
					break;
				case 402:
					$scope.message_error = 'Contraseña incorrecta';
					break;
			}

		});
	}

	$scope.eliminar_sucursal = function(){
		$scope.message_ok = null;
		$scope.message_error = null;

		if ($scope.contrasenia == ''){
			$scope.message_error = 'Escriba su contrasenia';
			return;
		}

		servidor.elimina_sucursal($scope.sucursal_editando.id_sucursal,$scope.contrasenia,function(response){
			switch(response.status){
				case 200:
					$scope.message_ok = 'Sucursal eliminada correctamente';
					$scope.obten_sucursales();
					break;
				case 402:
					$scope.message_error = 'Contraseña incorrecta';
					break;
			}			
		});
	}	

	$scope.click_sucursal = function(index){
		$scope.sucursal_editando_status = true;
		$scope.sucursal_editando = JSON.parse(JSON.stringify($scope.sucursales[index]));
	};

	$scope.obten_sucursales = function(){
		servidor.obten_sucursales(function(response){
			console.log(response);
			$scope.sucursales = response.data;
		});
	};

	$scope.obten_sucursales();

	$scope.agrega = function () {
		$scope.message_error = null;
		$scope.message_ok = null;

		if (!$scope.sucursal.nombre || !$scope.sucursal.direccion || !$scope.sucursal.contrasenia){
			$scope.message_error = 'Rellene todos los campos';
			return;
		}

		servidor.inserta_sucursal($scope.sucursal.id_sucursal,$scope.sucursal.nombre,$scope.sucursal.direccion,$scope.sucursal.contrasenia,function(response){
			switch(response.status){
				case 200:
					$scope.message_ok = 'Sucursal agregada correctamente';
					break;
				case 402:
					$scope.message_error = 'Contraseña incorrecta';
					break;
				case 400:
					$scope.message_error = 'Ya existe una sucursal con ese id';
					break;
			}
		});

	};

});
app.controller('porcentajeCtrl',function($scope,servidor){


});
app.controller('configuracionesCtrl',function($scope,servidor,token){
	$scope.nombre_sucursal = token.get_token().user;


});
app.controller('alertaCtrl',function($scope,servidor,token){
	$scope.parametro = 0;

	console.log("configuracionesCtrl");
	$scope.nombre_sucursal = token.get_token().user;

	servidor.obten_parametro(function(response){
		console.log(response);
		$scope.parametro = response.data[0].parametro_alerta || 0;

	});

	$scope.guardar_parametro = function(){
		$scope.message_ok = null;
		$scope.message_error= null;

		servidor.establece_parametro($scope.parametro,function(response){
			console.log(response);
			switch (response.status){
				case 200:
					$scope.message_ok = "Parametro guardado con exito";
					break;
				case 400:
					$scope.message_error = "Escriba un valor valido como parametro";
					break;
			}

		});
	};

});

app.controller('promocionesCtrl',function($scope,servidor,token,$window){
	$scope.editando = false;
	$scope.promocion_editando = {};
	$scope.promociones = [];
	$scope.promocion = {};
	$scope.contrasenia = '';
	$scope.message_error = null;
	$scope.message_ok = null;

	$scope.eliminar = function(){
		$scope.message_error = null;
		$scope.message_ok = null;

		if ($scope.contrasenia == ''){
			$scope.message_error = 'Escriba  su contrasenia';
			return;
		}
		servidor.elimina_promocion($scope.promocion_editando.id_promocion,$scope.contrasenia,function(response){
			switch(response.status){
				case 200:
					$scope.message_ok = 'Promocion eliminada correctamente';
					$scope.editando = false;
					$scope.obten_promociones();
					return;
				case 403:
					$scope.message_error = 'Contraseña incorrecta';
					break;

			}
		});
	};

	$scope.edita_promocion = function(index){
		$scope.editando = true;

		$scope.promocion_editando = JSON.parse(JSON.stringify($scope.promociones[index]));

	};

	$scope.guardar = function(){
		$scope.message_error = null;
		$scope.message_ok = null;

		if ($scope.contrasenia == ''){
			$scope.message_error = 'Escriba  su contrasenia';
			return;
		}

		servidor.modifica_promocion($scope.promocion_editando,$scope.contrasenia,function(response){
			switch(response.status){
				case 200:
					$scope.message_ok = 'Promocion modificada correctamente';
					$scope.editando = false;
					$scope.obten_promociones();

					break;
				case 402:
					$scope.message_error = 'Contraseña incorrecta';
					break;

			}
		});

	};

	$scope.agregar = function(){
		$scope.message_error = null;

		if (!$scope.promocion.nombre || !$scope.promocion.porcentaje || !$scope.promocion.contrasenia){
			$scope.message_error = 'Rellene todos los campos';
			return;
		}

		servidor.inserta_promocion($scope.promocion.nombre,$scope.promocion.descripcion,$scope.promocion.porcentaje,$scope.promocion.contrasenia,function(response){
			console.log(response);
			switch(response.status){
				case 200:
					$scope.message_ok = 'Promocion agregada correctamente';
					break;
				case 400:
					$scope.message_error = 'Escriba un porcentaje númerico';
					break;
				case 402:
					$scope.message_error = 'Contraseña incorrecta';
					break;
			}

		});

	};


	$scope.obten_promociones = function(){
		servidor.get_promociones(function(response){
			switch(response.status){
				case 0 || 401:
					$window.location = "#/";
					$window.location.reload();
					break;
				case 200:
					$scope.promociones = response.data;
					break;

			}
			console.log(response)
		});
	};
	$scope.obten_promociones();

});

app.controller('usuariosCtrl',function($scope,servidor,token){
	$scope.usuarios = [];
	$scope.muestra_info_ok = false;

	$scope.usuario_editando = {};
	$scope.contrasenia_usuario = '';
	$scope.message_ok = null;
	$scope.message_error = null;

	$scope.eliminar_usuario = function(){
		$scope.message_ok = null;
		$scope.message_error = null;

		if ($scope.contrasenia_usuario == ''){
			$scope.message_error = 'Ingrese su contraseña';
			return;
		}

		servidor.elimina_usuario($scope.usuario_editando.id_usuario,$scope.contrasenia_usuario,function(response){
			switch(response.status){
				case 402:
					$scope.message_error = 'Clave del usuario actual incorrecta';
					break;
				case 200:
					$scope.message_ok = 'Usuario eliminado correctamente';
					$scope.obten_usuarios();
					$scope.muestra_info_ok = false;
					break;
			}
		})
	};

	$scope.cancelar = function(){
		$scope.muestra_info_ok = false;
	}

	$scope.click_usuario = function(index){
		$scope.usuario_editando = JSON.parse(JSON.stringify($scope.usuarios[index]));
		$scope.muestra_info_ok = true;
		
	}
	$scope.guardar_cambios = function(){
		$scope.message_ok = null;
		$scope.message_error = null;

		if ($scope.contrasenia_usuario == ''){
			$scope.message_error = 'Ingrese su contraseña';
			return;
		}

		servidor.modifica_usuario($scope.usuario_editando,$scope.contrasenia_usuario,function(response){
			switch(response.status){
				case 200:
					$scope.message_ok = 'Usuario modificado correctamente';
					$scope.obten_usuarios();

					break;
				case 402:
					$scope.message_error = 'Clave del usuario actual incorrecta';
					break;

			}

		});
	}
	$scope.obten_usuarios = function(){

		servidor.obten_usuarios(function(response){
			$scope.usuarios = response.data;
			console.log(response);

		});		
	}


	$scope.registrar_usuario = function(){

		if ($scope.contrasenia_usuario == ''){
			$scope.message_error = 'Ingrese su contraseña';
			return;
		}

		servidor.registrar_usuario($scope.persona.nombre,$scope.persona.apellido,$scope.persona.password,$scope.contrasenia_usuario,function(response){
			switch(response.status){
				case 402:
					$scope.message_error = 'Clave del usuario actual incorrecta';
					break;
				case 200:
					$scope.persona = {};
					$scope.message_ok = 'Usuario agregado correctamente';
					$scope.obten_usuarios();

					break;
			}
			
		});
	};

	$scope.obten_usuarios();
});

app.controller('registrosCtrl',function($scope,servidor,token) {
	$scope.transacciones = [];
	$scope.sin_filtro = [];
	$scope.filtro = {};

	$scope.actualiza_datos = function(){
		servidor.get_transacciones(function(response) {
			
			$scope.transacciones = [];

			for (i = 0;i < response.data.length;i++){
				var fecha = new Date();

			 	response.data[i].fecha_transaccion= new Date(response.data[i].fecha_transaccion).toLocaleString();
			 	
			 	if ($scope.filtro.id_monedero != undefined && $scope.filtro.id_monedero != ''){
			 		console.log($scope.filtro.id_monedero);
			 		if (response.data[i].id_monedero == $scope.filtro.id_monedero){

			 			$scope.transacciones.push(response.data[i]);
			 		}
			 	}else{
			 		$scope.transacciones.push(response.data[i]);
			 	}

			 	var fecha_mod = response.data[i].fecha_transaccion.split(" ")[0];
			 	console.log(fecha_mod);

			 	if ($scope.filtro.fecha != undefined && $scope.filtro.fecha != ''){
			 		if ($scope.filtro.fecha == fecha_mod){
			 			$scope.transacciones.push(response.data[i]);
			 		}
			 	}

			}
		});
	}

	$scope.actualiza_datos();

});
app.controller('menuCtrl',function($scope,$location,servidor,token,$window,$timeout){
	$scope.alertas = [];

	$scope.nombre_sucursal = token.get_token().user;


	servidor.get_alertas(function(response){
		$scope.alertas =response.data;
		console.log(response);
	});

	$scope.location = $location.path();

	$scope.items = [

	      {path: '/home', title: 'Abonos'},
	      {path: '/altas', title: 'Altas'},
	      // {path: '/bajas', title: 'Bajas'},
	      {path: '/registros', title: 'Registros'},
	      {path: '/usuarios', title: 'Usuarios'},
	      {path: '/sucursales', title: 'Sucursales'},
	      {path: '/promociones', title: 'Promociones'},
	      {path: '/configuraciones', title: 'Configuraciones'},
	    ];

	$scope.$watch('location',function(){
		console.log("location ha cambiado");
		if ($scope.location != '/' && $scope.location != ''){
				servidor.get_alertas(function(response){
					$scope.alertas =response.data;
					console.log(response);
				});

			servidor.check(function(response){
				console.log(response);
				if (response.status != 200){
					$window.location = "#/";
					//$window.location.reload();
				}
				
			});			
		}
	});
	$scope.isActive = function(item) {
		$scope.location = $location.path();
		return item.path == $location.path();
    };
});

app.controller('bajasCtrl',function($scope,servidor,token){

	$scope.nombre_sucursal = token.get_token().user;

	$scope.desactivar = function(){
		$scope.message_ok = null;
		$scope.message_error = null;

		if (!$scope.id_monedero || !$scope.contrasenia){
			$scope.message_error = 'Rellene todos los campos';
			return;
		}

		servidor.baja_monedero($scope.id_monedero,$scope.contrasenia,function(response){
			console.log(response);
			switch(response.status){
				case 200:

					$scope.message_ok = "Monedero dado de baja correctamente";
					break;
				case 400:
					$scope.message_error = 'No existe un monedero con el id especificado o ya está dado de baja';
					break;
				case 402:
					$scope.message_error = 'Contraseña incorrecta';
					break;
			}
		});
	}
});

app.controller('altasCtrl',function($scope,token,servidor){
	$scope.persona = {};
	$scope.nombre_sucursal = token.get_token().user;

	$scope.activar = function(){
		console.log($scope.persona);
		$scope.message_ok = null;
		$scope.message_error = null;

		servidor.inserta_persona_monedero($scope.persona,function(response){
			console.log(response);
			switch (response.status){
				case 500:
					$scope.message_error  = 'Ya existe un monedero con el id especificado';
					break;
				case 200:
					$scope.message_ok = "Monedero agregado correctamente";
					break;

			}
		});
	};	

});

app.controller('homeCtrl',function($scope,servidor,$window,token){
	$scope.login_ok = false;
	$scope.monedero = {};
	$scope.nombre_sucursal = token.get_token().user;
	$scope.monedero_activo = true;
	$scope.promociones = {};
	$scope.promociones.select = -1;
	$scope.promo_seleccionada = {};
	$scope.ticket_activado = false;

	$scope.obten_ticket = function(){

		servidor.obten_ticket(function(response){
			console.log(response);
			if (response.data[0].ticket == 1){
				$scope.ticket_activado = true;
			}else{
				$scope.ticket_activado = false;
			}
		});
	}
	
	$scope.obten_persona_monedero = function(){
		servidor.get_persona_monedero($scope.monedero.id_monedero,function(response){
			
			$scope.message_error = null;
			$scope.datos_ok = false;
			$scope.message_ok  = null;

		if ($scope.monedero.id_monedero == undefined) return;

			switch(response.status){
				case 200:
					if (response.data.length > 0){

						if (response.data[0].estado_activado == 0){
							$scope.monedero_activo = false;
							$scope.message_error  = 'El monedero está desactivado, no se pueden hacer transacciones';
							return;
						}
						$scope.monedero_activo = true;
						$scope.nombre = response.data[0].nombre;
						$scope.apellido_pat = response.data[0].apellido_pat;
						$scope.apellido_mat = response.data[0].apellido_mat;
						$scope.monto = response.data[0].monto;
						$scope.datos_ok = true;	
					}


					break;
				case 400:

					$scope.message_error  = 'No existe un monedero con el id especificado';
					break;
			}

		});	
	};

	$scope.limpia_mensaje = function(){
		$scope.message_error = null;
	};
	$scope.obten_promocion = function(){
		for (i = 0; i < $scope.promociones.data.length;i++){
			if ($scope.promociones.data[i].id_promocion == $scope.promociones.select){
				console.log($scope.promociones.data[i].porcentaje);
				$scope.promo_seleccionada = $scope.promociones.data[i];
			}
		}
		$scope.limpia_mensaje();
	};

	$scope.quita = function(){
		$scope.message_ok  = null;
		$scope.message_error = null;

		if (!$scope.monedero_activo){
			$scope.message_error = 'El monedero está desactivado, no se pueden hacer transacciones';
		}
		if (!$scope.datos_ok){
			$scope.message_error = 'Escriba un id de monedero valido';
			return;
		}

		if (!$scope.monedero.monto){
			$scope.message_error = 'Escriba un monto';
			return;
		}

		if ($scope.monto - $scope.monedero.monto < 0){
			$scope.message_error = 'El monto a retirar es mayor que el que existe';
			return;
		}
		var nuevo_monto = $scope.monto - $scope.monedero.monto;
		console.log ("nuevo monto: " + nuevo_monto);

		swal(
				{   
					title: "Confirmacion", 
					text: "¿Esta seguro de hacer el retiro por: $" + ($scope.monedero.monto) + " ?" ,
				   	type: "warning",
			      	showCancelButton: true,
		         	confirmButtonColor: "#DD6B55",
		            confirmButtonText: "OK",
	               	closeOnConfirm: true 
	           	},
	           	function(){
					servidor.set_monedero($scope.monedero.id_monedero,nuevo_monto,function(response){
						console.log(response);
						switch(response.status){
							case 200:
								$scope.message_ok = 'Se ha quitado el monto especifado';
								$scope.monto = nuevo_monto;

								break;
						}
					});
	           	}
           	);


	};

	$scope.agrega = function(){
		$scope.message_ok  = null;
		$scope.message_error = null;


		if (!$scope.monedero_activo){
			$scope.message_error = 'El monedero está desactivado, no se pueden hacer transacciones';
			return;	
		}

		if (!$scope.datos_ok){
			$scope.message_error = 'Escriba un id de monedero valido';
			return;
		}

		if (!$scope.promo_seleccionada.porcentaje ){
			$scope.message_error = 'Seleccione un porcentaje';

			return;
		}

		if (!$scope.monedero.monto){
			$scope.message_error = 'Escriba un monto';
			return;
		}

		var nuevo_monto = $scope.monto + ($scope.monedero.monto * ($scope.promo_seleccionada.porcentaje / 100));
		
		console.log ("nuevo monto: " + nuevo_monto);

		swal(
				{   
					title: "Confirmacion", 
					text: "¿Esta seguro de hacer el abono por: $" + ($scope.monedero.monto * ($scope.promo_seleccionada.porcentaje / 100)) + " ?" ,
				   	type: "warning",
			      	showCancelButton: true,
		         	confirmButtonColor: "#DD6B55",
		            confirmButtonText: "OK",
	               	closeOnConfirm: true 
	           	},
	           	function(){

					servidor.set_monedero($scope.monedero.ticket,$scope.monedero.id_monedero,nuevo_monto,function(response){
						console.log(response);

						$scope.message_ok = null;
						$scope.message_error = null;

						switch(response.status){
							case 200:
								$scope.message_ok = 'Se ha abonado el monto especifado';
								$scope.monto = nuevo_monto;
								break;
							case 400:
								if ($scope.ticket_activado){
									$scope.message_error = 'Ya existe un ticket con ese numero';

								}else{
									$scope.message_error = 'Ocurrio un error, intente de nuevo';
								}
								
						}

					});
	           	}
           	);


	};
	servidor.get_promociones(function(response){
		switch(response.status){
			case 0 || 401:
				$window.location = "#/";
				//$window.location.reload();
				break;
			case 200:
				$scope.login_ok = true;
				$scope.promociones.data = response.data;
				break;

		}
		console.log(response)
	});

	$scope.obten_ticket();


});