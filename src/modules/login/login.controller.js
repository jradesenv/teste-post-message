angular.module('sc.modules')
    .controller('loginCtrl', loginCtrl);

function loginCtrl($scope, sessionService, messageService) {
    var vm = $scope;
    vm.usuario = "";
    vm.senha = "";    
    vm.login = login;
    
    function login(){
        sessionService.login(vm.usuario, vm.senha, function(autenticado, msg){
            if(autenticado) {
                alert("autenticado!");
            }
            if(msg) {
                if(autenticado){
                    messageService.showMessage(msg);
                } else {
                    messageService.showError(msg);
                }
            }
        });
    }
}