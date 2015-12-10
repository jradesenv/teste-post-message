angular.module('sc.modules')
    .controller('tarefasDetalheCtrl', tarefasDetalheCtrl);

function tarefasDetalheCtrl($scope, $window) {
    var vm = $scope;

    vm.voltar = function() {
         $window.history.back();
    };
    
    var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = $window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    
    // Listen to message from child window
    eventer(messageEvent,function(e) {
        var key = e.message ? "message" : "data";
        var data = e[key];
        
        if(data.indexOf("MSG_TOKEN") > -1) {
            alert(data.split(":")[1]);
        } else if (data.indexOf("BACK_TOKEN") > -1) {
            alert('voltando...');
        }
        
    },false);    
};