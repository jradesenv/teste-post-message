angular.module('sc.services')

	.factory('SessionService', sessionService);

function sessionService($localStorage) {
	return {
		setSession: setSession,
		getSession: getSession,
		logout: logout
	}

	function setSession(usuario, callback) {
		delete usuario.senha;
		$localStorage.session = JSON.stringify(usuario);
		if (callback)
			callback();
	}

	function getSession() {
		var retorno = JSON.parse($localStorage.session);
		console.log("getSession: ", retorno);
		return retorno;
	}

	function logout() {
		delete $localStorage.session;
	}
}