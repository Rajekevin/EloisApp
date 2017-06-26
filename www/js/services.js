/**
 * Created by Rajekevin on 22/06/2017.
 */
angular.module('starter')


/***
 *Service Comparateur Emprunteur
 */
    .service('EmprunteurService', function($q, $http, USER_ROLES) {

      var LOCAL_TOKEN_KEY = 'yourTokenKey';


      var storeFormCredentials =  function(data) {


          //Conversion des Objects en chaine JSON
          var datasTring = JSON.stringify(data);


          //Stockage des données du Formulaire en Session
          sessionStorage.setItem("FormDatas",datasTring);

          //Récupération des données par la key : FormDatas
          var FormDatas = sessionStorage.getItem("FormDatas");



          console.log('store successfully !!!!!');

          return FormDatas;
        };


        return {
            store: storeFormCredentials
        };

    })




/***
 * Service Authentification
 */
    .service('AuthService', function($q, $http, USER_ROLES) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var username = '';
        var isAuthenticated = false;
        var role = '';
        var authToken;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            username = token.split('.')[0];
            isAuthenticated = true;
            authToken = token;


            if (username == 'admin') {
                role = USER_ROLES.admin
            }

            console.log(username);
            if (username == 'user' || username != '') {
                //role = USER_ROLES.public
                role = USER_ROLES.admin
            }


            // Set the token as header for your requests!
            $http.defaults.headers.common['X-Auth-Token'] = token;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['X-Auth-Token'] = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }


        var login = function(name, pw) {

            return $q(function(resolve, reject) {


                var url = "https://intra.elois.fr/mobileConnect?";

                // on hash le mdp en md5
                var hash =hex_md5(pw);

                $http({
                    method: 'POST',
                    data : {name : name,   pwd : hash },
                    url: url
                }).
                    success(function(status) {
                        //your code when success

                        console.log("sucessstat "+status);


                        if(status=='true'){

                            var auth = 1;
                            storeUserCredentials(name +'.'+ pw +'.yourServerToken');
                            resolve('Login success.');

                        }else{
                            reject('Login Failed.');

                        }
                    });

            });
        };

        var logout = function() {
            destroyUserCredentials();
        };

        var isAuthorized = function(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };

        loadUserCredentials();

        return {
            login: login,
            logout: logout,
            isAuthorized: isAuthorized,
            isAuthenticated: function() {return isAuthenticated;},
            username: function() {return username;},
            role: function() {return role;}
        };
    })


    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });