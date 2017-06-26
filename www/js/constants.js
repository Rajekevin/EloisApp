/**
 * Created by Rajekevin on 22/06/2017.
 */
angular.module('starter')

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 'admin_role',
        public: 'public_role'
    });