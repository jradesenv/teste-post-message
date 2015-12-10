angular.module('sc.services')

	.factory('ConstantService', ConstantService);

function ConstantService() {
	var constants = {};
	
	constants.urlLogin = "https://redecolaborativa.sicredi.com.br/sma/loginonget.fcc";
	constants.urlLogout = "https://redecolaborativa.sicredi.com.br/sma/logout.fcc";
	constants.urlPocServer = "http://sibmobi.des.sicredi.net/middleware/MWServlet";
	constants.urlKonyServer = "https://sicmobi.sicredi.com.br/middleware/MWServlet";
	constants.urlBuscarUsuario = constants.urlKonyServer;
	constants.urlBuscarMenuUsuario = constants.urlKonyServer;
	constants.urlListarTarefas = constants.urlPocServer;
	
	return constants;
}