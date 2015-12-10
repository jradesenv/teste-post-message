angular.module('sc.modules')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // Each tab has its own nav history stack:
        .state('login', {
            url: '/login',
            templateUrl: 'modules/login/index.html',
            controller: 'loginCtrl'
        });
    });