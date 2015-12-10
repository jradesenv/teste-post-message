angular.module('sc.modules')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
      
        .state('lista-participantes', {
            url: '/participantes/lista-participantes/:id_assembleia',
            templateUrl: 'modules/participantes/lista-participantes.html',
            controller: 'participantesCtrl'
            
        });
    });