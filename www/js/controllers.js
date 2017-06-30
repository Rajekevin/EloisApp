/**
 * Created by Rajekevin on 22/06/2017.
 */

angular.module('starter')

   .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
        $scope.username = AuthService.username();

        $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Erreur !',
                template: 'Vous n\'êtes pas autorisé à accéder à cette application'
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
            AuthService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Session Perdu!',
                template: 'Veuillez nous excusez pour la gêne occasionnée, vous devez vous reconnecter !'
            });
        });

        $scope.setCurrentUsername = function(name) {

            $scope.username = name;
        };
    })


    .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
        $scope.data = {};

        $scope.login = function(data) {


            AuthService.login(data.username, data.password).then(function(authenticated) {
                $state.go('main.dash', {}, {reload: true});
                $scope.setCurrentUsername(data.username);
            }, function(err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Echec Authentification !',
                    template: 'Veuillez vérifier votre nom d\'utilisateur et mot de passe !'
                });
            });
        };
    })



/**
 * Controlleur Comparateur Emprunteur
 */
    .controller('suiviDossiersCtrl', function($scope,$ionicLoading, $state, $http,$ionicPopup, suiviDossiersService) {
        //$scope.data = {};
      var mesDatas;

        $scope.datass =  suiviDossiersService.afficheDossier();



        $scope.datass.then(function(data) {
            $scope.mesDatas = data;

            console.log("Scope dossier service ==>");
            console.log( $scope.mesDatas);
        });


    })




/**
 * Controlleur Comparateur Emprunteur
 */
    .controller('EmprunteurCtrl', function($scope,$ionicLoading, $state, $http,$ionicPopup, EmprunteurService) {
        $scope.data = {};

        console.log('Service===>');
        console.log(EmprunteurService);

        $scope.Emprunteur = function(data) {

            console.log(data);
            console.log("Emprunteur=====>");



            EmprunteurService.store(data);
            EmprunteurService.send(data);

            $ionicLoading.show({
                template:'Loading....'
            });

            $http.get(url).success(function(response){
                $ionicLoading.hide();
            })

        };


    })


    .controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
        $scope.logout = function() {
            AuthService.logout();
            $state.go('login');
        };

        $scope.performValidRequest = function() {
            $http.get('http://localhost:8100/valid').then(
                function(result) {
                    $scope.response = result;
                });
        };

        $scope.performUnauthorizedRequest = function() {
            $http.get('http://localhost:8100/notauthorized').then(
                function(result) {
                    // No result here..
                }, function(err) {
                    $scope.response = err;
                });
        };

        $scope.performInvalidRequest = function() {
            $http.get('http://localhost:8100/notauthenticated').then(
                function(result) {
                    // No result here..
                }, function(err) {
                    $scope.response = err;
                });
        };
    });