angular.module('sc.services')

	.factory('konyService', KonyService);

function KonyService(constantService, $http, messageService) {
	return {
		call: call,
		postRequest: postRequest,
		handleRequestError: handleRequestError,
		newKonyServiceCallObject: newKonyServiceCallObject,
		callMultipleKonyServices: callMultipleKonyServices
	}

	function call (strServiceID, objInputParameters, funSuccessCallback, funErrorCallback){
		try{			
			var inputParameters = {};
			if(typeof objInputParameters !== "undefined"){
			    for(var i in objInputParameters){
			        inputParameters[i] = objInputParameters[i];
			    }
			}
			inputParameters.serviceID = strServiceID;
			inputParameters.appID = constantService.appId;
			inputParameters.channel = constantService.channel;		   
		   	
		   	var middlewareUrl = constantService.urlPocServer;
		   	if(strServiceID === "buscarUsuario" || strServiceID === "buscarNavegacaoMobile"){
		   		middlewareUrl = constantService.urlKonyServer;
		   	}
		   	
		   	if(constantService._mockUsuarioService && (strServiceID === "buscarUsuario" || strServiceID === "buscarNavegacaoMobile")){
		   		var response;
		   		if(strServiceID === "buscarUsuario"){
		   			response = {
		   				id: "usuario_mock", 
		   				urlFoto: "http://teste.teste" 
		   			};
		   		} else {
		   			var _arrMockMenu = [];
		   			response = {
		   				menu: _arrMockMenu
		   			};
		   		}
		        if(typeof funSuccessCallback === "function") {
		        	funSuccessCallback(response);
		        }
		   	} else {		   		
			    $http.post(middlewareUrl, inputParameters, function(status, response){
					if(status == 400){
					    if(response.opstatus === 0){
					        if(typeof funSuccessCallback === "function") {
					        	funSuccessCallback(response);
					        }
					    } else {
					        if(typeof funErrorCallback === "function") {
					        	funErrorCallback(response);
					        } else {
					        	handleRequestError(strServiceID, response);
					        }
					    }
					}
			    });			    
		    }
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function handleRequestError(serviceID, response){
		try{
			var msg = "Erro ao chamar serviço: " + serviceID;
        	if(typeof response !== "undefined") {
				switch(response.opstatus.toString()){
					case "1011":
						msg = "Por favor, verifique sua conexão de internet.";
						break;
					default:
		        		msg += " | opstatus:" + response.opstatus;
		        		if(typeof response.errmsg !== "undefined")  {
		        			msg += " | errmsg: " + response.errmsg;
		        		}
				}
			}
			
			messageService.showError(msg);
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function callMultipleKonyServices(arrServiceCallObjects, callback){
		try{
			var arrResult = [];
			var funcResolve = function(response, thisCallback){
				arrResult.push(response);
				if(typeof thisCallback === "function") {
					thisCallback(response);
				}
				if(arrResult.length === arrServiceCallObjects.length){
					callback(arrResult);
				}
			};
			
			for(var i = 0, len = arrServiceCallObjects.length; i < len; i++){
				(function(index){ //IIFE to preserve scope variables to each async call
					var serviceCallObject = arrServiceCallObjects[index];
					serviceCallObject.call(function(response){
						funcResolve(response, serviceCallObject.funSuccessCallback);
					}, function(response){
						funcResolve(response, serviceCallObject.funErrorCallback);
					});
				})(i);				
			}		
		} catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function newKonyServiceCallObject(strServiceID, objInputParameters, funSuccessCallback, funErrorCallback){
		try{
			var callObject = {
				serviceID: strServiceID,
				inputParameters: objInputParameters,
				funSuccessCallback: funSuccessCallback,
				funErrorCallback: funErrorCallback,
				call: function(successCallback, errorCallback){
					var _this = this;
					call(
						_this.serviceID, 
						_this.inputParameters, 
						function(response) { 
							var func = typeof successCallback === "function" ? successCallback : _this.funSuccessCallback;
							func(response, _this);
						},
						function(response) { 
							var func = typeof errorCallback === "function" ? errorCallback : _this.funErrorCallback;
							func(response, _this);
						}
					);
				}
			};
			
			return callObject;
		} catch(ex) {
			messageService.showError(ex.message);
		}
	}
	
	function postRequest(url, objBody, funSuccessCallback, funErrorCallback){
		try{
			if(constantService._mockLoginService){
				if(url.indexOf(constantService.urlLogin) > -1){
					funSuccessCallback('{"authentication": "true"}');
				}
			} else {
				$http.post(url, objBody, {
					headers: {'user-agent': ionic.Platform.platform()}
				})
				.then(funSuccessCallback)
				.error(funErrorCallback);
			}
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function isEmpty(valor){
		return valor === null || typeof valor === "undefined" || valor.length === 0;
	}
}