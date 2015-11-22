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
        'fancyboxplus'
    ])

    .config(['RestangularProvider', function (RestangularProvider) {
        RestangularProvider.setBaseUrl(config.api.url);
    }])

    .run(['Restangular', '$http', '$state', 'Notification', '$rootScope', '$log', 'AuthService', '$timeout', start]);

function start(Restangular, $http, $state, Notification, $rootScope, $log, AuthService, $timeout) {

    if (AuthService.isAuthed()) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + AuthService.getToken();
    }


    Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        // log every response from the server in debug (filter )
        console.debug(data);

        // if there a token is received, attach it to the current session
        if (data && data.token) {
            Notification(JSON.stringify(AuthService.parseJwt(data.token)));
            $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
            AuthService.saveToken(data.token);
        }
        return data;
    });


    Restangular.setErrorInterceptor(
        function (response) {
            // https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
            Notification.error("Erreur HTTP : " + response.status);


            if(response.status == 401) {

                AuthService.logout();
            }
            return false;
        }
    );

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && !AuthService.isAuthed()) {
            event.preventDefault();
            Notification.error("Merci de vous authentifier");
            $state.go("welcome");
        }

        //if (AuthService.isAuthed() && requireLogin) {
        //  Notification.primary("Authentifié !");
        //}

        if (toState.name == 'auth.authAdmin' && AuthService.isAuthed()) {
            $timeout(function() {
                $state.transitionTo("admin.mainClassList")
            },10)
        }

    });

}

