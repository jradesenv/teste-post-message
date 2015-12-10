angular.module('sc.services')

	.factory('messageService', MessageService);

function MessageService() {
	return {
		showMessage: showMessage,
		showError: showError
	}

	function showMessage(msg){
		alert(msg);
	}
	
	function showError(msg){
		alert(msg);
	}
}