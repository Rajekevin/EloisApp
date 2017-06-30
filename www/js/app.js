// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('starter', ['ionic', 'ngMockE2E'])

angular.module('starter', ['ionic'])




    .config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('main', {
                url: '/',
                abstract: true,
                templateUrl: 'templates/main.html'
            })
            .state('main.dash', {
                url: 'main/dash',
                views: {
                    'dash-tab': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('main.suiviDossiers', {
                url: 'main/suiviDossiers',
                views: {
                    'public-tab': {
                        templateUrl: 'templates/suiviDossiers.html',
                        controller: 'suiviDossiersCtrl'
                    }
                }
            })
            .state('main.comparateurEmprunteur', {
                url: 'main/comparateurEmprunteur',
                views: {
                    'admin-tab': {
                        templateUrl: 'templates/comparateurEmprunteur.html',
                        controller: 'EmprunteurCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            });

        // Thanks to Ben Noblet!
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("main.dash");
        });
    })


    .run(function($httpBackend){
        //$httpBackend.whenGET(/templates\/\w+.*/).passThrough();
    })


    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
        $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

            if ('data' in next && 'authorizedRoles' in next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    $state.go($state.current, {}, {reload: true});
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                }
            }

            if (!AuthService.isAuthenticated()) {
                if (next.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        });
    })