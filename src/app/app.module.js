"use strict";

var assomakerApp = angular.module('photosApp', [
  'ui.router',
  'ui.router.stateHelper',
  'restangular',
  'ui.bootstrap',
  'angular-loading-bar',
  'ngAnimate',
  'ui-notification',
  'photosApp.services'
])

  .config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setBaseUrl(config.api.url);
  }])

  .run(['Restangular', '$http', '$state', 'Notification', '$rootScope', '$log', start]);

function start(Restangular, $http, $state, Notification, $rootScope, $log) {

  Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
    // log every response from the server in debug (filter )
    $log.debug(data);
  });


  Restangular.setErrorInterceptor(
    function (response) {
      // https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
      Notification.error("Erreur HTTP : " + response.status);
      return false;
    }
  );

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    // TODO : ADD redirection
    if (requireLogin) {
      // event.preventDefault();
      Notification.error("Merci de vous authentifier");
    }
  });

  Notification.success("app running !");
}

