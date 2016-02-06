"use strict";

var photosApp = angular.module('photosApp', [
    'ui.router',
    'ui.router.stateHelper',
    'restangular',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngAnimate',
    'angularFileUpload',
    'ui-notification',
    'smart-table',
    'photosApp.services',
    'fancyboxplus',
    'vModal',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ui.grid.edit',
    'ngDialog',
    'ui.grid.resizeColumns',
    'oitozero.ngSweetAlert',
    'ui.grid.grouping'
])

.config(['RestangularProvider', '$locationProvider', function(RestangularProvider, $locationProvider) {
    RestangularProvider.setBaseUrl(config.api.url);
    //$locationProvider.html5Mode(true);
}])

.run(['Restangular', '$http', '$state', 'Notification', '$rootScope', '$log', 'AuthService', '$timeout', start]);

function start(Restangular, $http, $state, Notification, $rootScope, $log, AuthService, $timeout) {

    if (AuthService.isAuthed()) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + AuthService.getToken();
    }

    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        // log every response from the server in debug (filter )
        // console.debug(data);

        // if there a token is received, attach it to the current session
        if (data && data.token) {
            //   Notification(JSON.stringify(AuthService.parseJwt(data.token)));
            $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
            AuthService.saveToken(data.token);
        }
        return data;
    });


    Restangular.setErrorInterceptor(
        function(response) {
            // https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
            // Notification.error(response.status);
            if (response.status == 401) {
                Notification.error("Veuillez vous authentifier.");
                AuthService.logout();
                console.log(config.api.url + '/admin')
                if (response.config.url == (config.api.url + '/admin')) {
                    $state.transitionTo("auth.authAdmin");
                }
                else {
                    $state.transitionTo("welcome");
                }
            }
            else if (response.status == -1) {
                Notification.error("Le serveur ne répond pas, merci de contacter un administrateur");
            }
            else if (response.status == 400) {
                Notification.error("La requête est incorrecte. Corrigez là et réessayez.");
            }
            else if (response.status == 500) {
                Notification.error("Une erreur est survenu sur le serveur");
            }
            return false;
        }
    );

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if (toState.data) {
            var requireLogin = toState.data.requireLogin;
        }

        if (requireLogin && !AuthService.isAuthed()) {
            event.preventDefault();
            Notification.error("Merci de vous authentifier");
            $state.go("welcome");
        }

        if ((toState.name == 'auth.authAdmin') && AuthService.isAuthed()) {
            Restangular.one('/admin').get().then(function() {
                $timeout(function() {
                    $state.transitionTo("admin.detailsClasses");
                }, 10);
            });
        }

        if (toState.parent) {
            if (toState.parent.name == 'admin' && AuthService.isAuthed()) {
                Restangular.one('/admin').get();
            };
        }

    });

}
