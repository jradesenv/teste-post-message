angular.module('sc.services')

	.factory('constantService', ConstantService);

function ConstantService() {
	var constants = {};
	
	//mocks
	constants._mockUsuarioService = true;
	constants._mockLoginService = true;	
	//	
	constants.appId = "";
	constants.channel = "rc";
	constants.urlLogin = "https://redecolaborativa.sicredi.com.br/sma/loginonget.fcc";
	constants.urlLogout = "https://redecolaborativa.sicredi.com.br/sma/logout.fcc";
	constants.urlPocServer = "http://sibmobi.des.sicredi.net/middleware/MWServlet";
	constants.urlKonyServer = "https://sicmobi.sicredi.com.br/middleware/MWServlet";
	
	return constants;
}