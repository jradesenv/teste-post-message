angular.module('sc.modules')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // Each tab has its own nav history stack:
        .state('tab.assembleia', {
            url: '/assembleia',
            views: {
                'tab-assembleia': {
                    templateUrl: 'modules/assembleia/index.html',
                    controller: 'assembleiaCtrl'
                }
            }
        })
    });