angular.module('sc.modules')
    .controller('tarefasDetalheCtrl', tarefasDetalheCtrl);

function tarefasDetalheCtrl($scope) {
    var vm = $scope;

    vm.voltar = function() {
         window.history.back();
    };
};