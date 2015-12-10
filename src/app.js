var db = null;
angular.module('tarefasApp', ['ionic', 'sc.modules', 'sc.services'])

    .run(function ($ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.tabs.position('bottom');
        
        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'modules/menu/tabs.html'
            });
        $urlRouterProvider.otherwise('/tab/tarefas');
    });