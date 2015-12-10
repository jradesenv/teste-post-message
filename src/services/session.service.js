angular.module('sc.services')

	.factory('sessionService', SessionService);

function SessionService(constantService, $localStorage, konyService, messageService, menuService) {
	return {
		login: login,
		setSession: setSession,
		getSession: getSession,
		logout: logout
	}

	function login(username, password, callback){
		try{
			var loginUrl = constantService.urlLogin;
			var objBody = {
				password: password,
				user: username
			};
			
			konyService.postRequest(loginUrl, objBody, function(response) {
				if(response !== null && typeof response !== "undefined"){
					if(typeof response !== "string"){
						response = response.text; 
					}
				
					var isLogged = response.indexOf("401") === -1;
	
					if(isLogged && response.indexOf("{") > -1) {
						response = JSON.parse(response);
						isLogged = response.authentication && response.authentication === "true";
					}
					if(isLogged){
						var inputParameters = {
							usuario: username,
							senha: password	
						};
						
						var arrServices = [
							konyService.newKonyServiceCallObject("buscarUsuario", inputParameters, loadUserDataCallback, loadUserDataErrorCallback),
							konyService.newKonyServiceCallObject("buscarNavegacaoMobile", inputParameters, loadUserMenuCallback, loadUserMenuErrorCallback)
						];
						konyService.callMultipleKonyServices(arrServices, function(arrResponse){
							setSession({
								username: username
							});
							callback(true);
						});
					} else { 
						callback(false, "Usuário e/ou senha inválidos.");
					}
				
				} else {
					callback(false, "Não foi possível conectar ao servidor. Verifique sua conexão.");
				}
			}, function(error) {
				callback(false);
			});	
		} catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function loadUserDataErrorCallback(error){
		try{
			konyService.handleRequestError("buscarUsuario", error);
		} catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function loadUserMenuErrorCallback(error){
		try{
			konyService.handleRequestError("buscarNavegacaoMobile", error);
		} catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function loadUserDataCallback(response){
		try{
			menuService.configHeader(response.id, "Sicredi", response.urlFoto.replace("SMALL", "ORIGINAL"));
		} catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function loadUserMenuCallback(response){
		try{
			var itemMenu = response.menu;
			if(typeof itemMenu !== "undefined" && itemMenu !== null){				
				menuService.cleanItems();
				for(var i = 0; i < itemMenu.length; i++){
					menuService.addItem(itemMenu[i].nome, "WebviewController", itemMenu[i].caminho); //trocar controller por Rota	
				}
				
				menuService.addItem("Tarefas", "tab.tarefas");			 
				menuService.selectFirstItem();
			} else {
				messageService.showError("Não foi possível buscar o menu mobile!");
			}
		} catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function logout(){
		try{
			konyService.callKonyService("Logout", {}, function(result){
				delete $localStorage.session;
				window.close(); //exit app
			});
		}catch(ex){
			messageService.showError(ex.message);
		}
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
}