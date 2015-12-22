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
                    templateUrl: '/app/components/auth/loginPhotographer.html',
                    controller: 'loginPhotographerCtrl'
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
                },
                {
                    name: 'changePassword',
                    url: '/change-password/:param1',
                    controller: 'changePasswordCtrl',
                    templateUrl: '/app/components/auth/changePassword.html'
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
                    url: "/order?auth",
                    templateUrl: '/app/components/customer/orderView.html',
                    controller: 'orderCtrl'
                },
                {
                    name: 'orderCompleted',
                    url: '/orderCompleted',
                    templateUrl: '/app/components/customer/orderCompleted.html',
                    controller: 'orderCompletedCtrl',
                    params: {order : null}
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
                    url: "/upload?num",
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
                    name: 'detailsClasses',
                    url: "/classes",
                    templateUrl: '/app/components/admin/detailsClasses.html',
                    controller: 'detailsClasses'
                },
                {
                    name: 'orders',
                    url: "/orders",
                    templateUrl: '/app/components/admin/orders.html',
                    controller: 'ordersController'
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
                function ($state) {
                    $state.go('welcome')
                }]
        });


}]);
