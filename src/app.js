var db = null;
angular.module('assembleiasApp', ['ionic', 'sc.modules', 'sc.services', 'ngStorage'])

    .run(function ($ionicPlatform, $state, $localStorage) {
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
        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.tabs.position('bottom');
        
        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'modules/menu/tabs.html'
            });
            
        $urlRouterProvider.otherwise('/login');
        
    });