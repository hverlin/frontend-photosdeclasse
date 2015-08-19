"use strict";

assomakerApp.config(['stateHelperProvider', '$urlRouterProvider', function (stateHelperProvider, $urlRouterProvider) {

  // This version of otherwise allow to redirect the user when he is not logged in
  // see : https://github.com/angular-ui/ui-router/issues/600
  $urlRouterProvider.otherwise(function ($injector) {
    var $state = $injector.get("$state");
    $state.go("welcome");
  });

  stateHelperProvider
    .state({
      name: 'welcome',
      template: 'welcome !',
      data: {
        requireLogin: false
      }
    });
}]);
