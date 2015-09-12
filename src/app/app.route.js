"use strict";

photosApp.config(['stateHelperProvider', '$urlRouterProvider', function (stateHelperProvider, $urlRouterProvider) {

  stateHelperProvider

    .state({
      name: 'welcome',
      url: "/",
      templateUrl: '/app/components/welcome/welcome.html',
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
          templateUrl: '/app/components/auth/loginBureau.html',
          controller: 'loginBureauCtrl'
        },
        {
          name: 'authOrder',
          url: '/commande',
          controller: 'loginOrderCtrl',
          templateUrl: '/app/components/auth/loginOrder.html'
        }
      ]
    })
    .state({
      name: 'customer',
      url: '/customer',
      template: '<ui-view/>',
      abstract: 'true',
      data: {
        requireLogin: false
      },
      children: [
        {
          name: 'order',
          url: "/order",
          templateUrl: '/app/components/customer/orderView.html',
          controller: 'orderCtrl'
        }
      ]
    })
    .state({
      name: 'photographe',
      url: '/photographe',
      template: '<ui-view/>',
      abstract: 'true',
      data: {
        requireLogin: true
      },
      children: [
        {
          name: 'dashboard',
          url: "/dash",
          templateUrl: '/app/components/photographer/dashboard/dashboard.html',
          controller: 'dashboardCtrl'
        },
        {
          name: 'upload',
          url: "/upload",
          templateUrl: '/app/components/photographer/uploadView/uploadView.html',
          controller: 'uploadCtrl'
        }
      ]
    })
    .state({
      name: 'admin',
      url: '/bureau',
      template: '<ui-view/>',
      abstract: 'true',
      data: {
        requireLogin: true
      },
      children: [
        {
          name: 'mainClassList',
          url: "/classes",
          templateUrl: '/app/components/admin/mainViewClass.html',
          controller: 'selectionCtrl'
        },
        {
          name: 'photographers',
          url: "/photographes",
          templateUrl: '/app/components/admin/photographerList.html',
          controller: 'photographerListCtrl'
        }
      ]
    })
    .state({
      name: 'otherwise',
      url: "*path",
      template: "",
      controller: [
        '$state',
        function($state) {
          $state.go('welcome')
        }]
    });


}]);
