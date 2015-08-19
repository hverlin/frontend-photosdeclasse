"use strict";

assomakerApp.config(['stateHelperProvider', '$urlRouterProvider', function (stateHelperProvider, $urlRouterProvider) {

  // This version of otherwise allow to redirect the user when he is not logged in
  // see : https://github.com/angular-ui/ui-router/issues/600
  $urlRouterProvider.otherwise(function ($injector) {
    var $state = $injector.get("$state");
    console.log("go to /");
    $state.go("welcome");
  });

  stateHelperProvider


    .state({
      name: 'welcome',
      url: "/",
      template: 'welcome !',
      data: {
        requireLogin: false
      }
    })
    .state({
      name: 'auth',
      url: "/auth",
      abstract: 'true',
      template: '<ui-view/>',
      data: {
        requireLogin: false
      },
      children: [
        {
          name: 'authPhotographe',
          url: "/photographe",
          templateUrl: '/app/components/auth/loginPhotographer.html'
        },
        {
          name: 'authAdmin',
          url: '/bureau',
          templateUrl: '/app/components/auth/loginBureau.html'
        },
        {
          name: 'authOrder',
          url: '/commande',
          templateUrl: '/app/components/auth/loginOrder.html'
        }
      ]
    })
    .state({
      name: 'commander',
      url: '/commander',
      template: 'commander',
      data: {
        requireLogin: false
      }
    })
    .state({
      name: 'photographes',
      url: '/photographes',
      template: 'photographes !',
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'admin',
      url: '/bureau',
      template: 'admin',
      data: {
        requireLogin: true
      }
    });


}]);
