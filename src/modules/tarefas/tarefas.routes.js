angular.module('sc.modules')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // Each tab has its own nav history stack:
        .state('tab.tarefas', {
            url: '/tarefas',
            views: {
                'tab-tarefas': {
                    templateUrl: 'modules/tarefas/index.html',
                    controller: 'tarefasCtrl'
                }
            }
        })
        .state('tab.tarefas-detalhes', {
            url: '/tarefas/:id',
                views: {
                'tab-tarefas': {
                    templateUrl: 'modules/tarefas/tarefas-detalhe.html',
                    controller: 'AgendaChatController'
                }
            }
        });
    });