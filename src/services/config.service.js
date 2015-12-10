angular.module('sc.services')

	.factory('ConfigService', configService);


function configService($http, $ionicPlatform, $localStorage) {

	return {
		insertConfig: insertConfig,
		resetConfig: resetConfig,
		setAdministradoresDevice: setAdministradoresDevice,
		getListAdministradores: getListAdministradores
	}

	function setAdministradoresDevice(listAdministradores) {
		$localStorage.listAdministradores = JSON.stringify(listAdministradores);
	}

	function getListAdministradores() {
		return JSON.parse($localStorage.listAdministradores);
	}

	function insertConfig(config) {
		$ionicPlatform.ready(function () {
			if (window.cordova) {
				db.transaction(function (tx) {
					tx.executeSql("INSERT INTO tb_configs (nome_dispositivo,token_dispositivo ) VALUES (?,?,?)", [config.nome_dispositivo, config.token_dispositivo], function (tx, res) {
						console.log("último id inserido de config: " + res.insertId);
					});
				});
			}
		});
	}


	function resetConfig() {

	}
}