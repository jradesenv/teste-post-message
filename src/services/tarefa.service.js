angular.module('sc.services')

	.factory('tarefaService', TarefaService);

function TarefaService(konyService, messageService) {
	return {
		getTarefas: getTarefas,
		isPrioridadeAlta: isPrioridadeAlta,
		isPrioridadeBaixa: isPrioridadeBaixa
	}

	function getTarefas(usuario, somenteAdquiridas, searchText, callback){
		try{				   		   	
			searchText = searchText ? searchText : "";
			var inputParameters = {
				usuario: usuario,
				somenteAdquiridas: somenteAdquiridas,
				pagInicio: 1,
				pagFim: 20,
				idProcesso: searchText
			};
			
			konyService.callKonyService("listarTarefas", inputParameters, function(response){
				callback(response);
			});
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function isPrioridadeAlta(prioridade){
		try{
			var _prioridade = prioridade.toUpperCase();
			return _prioridade === "ALTA" || _prioridade === "MUITO ALTA";
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function isPrioridadeBaixa(prioridade){
		try{
			var _prioridade = prioridade.toUpperCase();
			return _prioridade === "BAIXA" || _prioridade === "MUITO BAIXA";
		}catch(ex){
			messageService.showError(ex.message);	
		}
	}
}