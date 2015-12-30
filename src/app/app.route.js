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
            children: [{
                name: 'authPhotographe',
                url: "/photographe",
                templateUrl: '/app/components/auth/loginPhotographer.html',
                controller: 'loginPhotographerCtrl'
            }, {
                name: 'authAdmin',
                url: '/bureau',
                templateUrl: '/app/components/auth/loginBureau.html',
                controller: 'loginBureauCtrl'
            }, {
                name: 'authOrder',
                url: '/commande',
                controller: 'loginOrderCtrl',
                templateUrl: '/app/components/auth/loginOrder.html'
            }, {
                name: 'changePassword',
                url: '/change-password/:param1',
                controller: 'changePasswordCtrl',
                templateUrl: '/app/components/auth/changePassword.html'
            }, {
                name: 'forgetPassword',
                url: '/forgetPassword',
                controller: 'forgetPasswordCtrl',
                templateUrl: '/app/components/auth/forgetPassword.html'
            }]
        })
        .state({
            name: 'customer',
            url: '/customer',
            template: '<ui-view/>',
            abstract: 'true',
            data: {
                requireLogin: false
            },
            children: [{
                name: 'order',
                url: "/order?auth",
                templateUrl: '/app/components/customer/orderView.html',
                controller: 'orderCtrl'
            }]
        })
        .state({
            name: 'photographe',
            url: '/photographe',
            template: '<ui-view/>',
            abstract: 'true',
            data: {
                requireLogin: true
            },
            children: [{
                name: 'dashboard',
                url: "/dash?state",
                templateUrl: '/app/components/photographer/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            }, {
                name: 'upload',
                url: "/upload?num",
                templateUrl: '/app/components/photographer/uploadView/uploadView.html',
                controller: 'uploadCtrl'
            }]
        })
        .state({
            name: 'admin',
            url: '/bureau',
            template: '<ui-view/>',
            abstract: 'true',
            data: {
                requireLogin: true
            },
            children: [{
                name: 'detailsClasses',
                url: "/classes",
                templateUrl: '/app/components/admin/detailsClasses.html',
                controller: 'detailsClasses',
                data: {
                    requireLogin: true
                }
            }, {
                name: 'orders',
                url: "/orders",
                templateUrl: '/app/components/admin/orders.html',
                controller: 'ordersController',
                data: {
                    requireLogin: true
                }
            }, {
                name: 'orderGroup',
                url: "/ordergroup?num",
                templateUrl: '/app/components/admin/groupOrderDetail.html',
                controller: 'ordersGroupController',
                data: {
                    requireLogin: true
                }
            }, {
                name: 'photographers',
                url: "/photographes",
                templateUrl: '/app/components/admin/photographerList.html',
                controller: 'photographerListCtrl',
                data: {
                    requireLogin: true
                }
            }, {
                name: 'upload',
                url: "/upload?num",
                templateUrl: '/app/components/admin/uploadView/uploadView.html',
                controller: 'uploadCtrlAdmin',
                data: {
                    requireLogin: true
                }
            }]
        })
        .state({
            name: 'otherwise',
            url: "*path",
            template: "",
            controller: [
                '$state',
                function ($state) {
                    $state.go('welcome');
                }
            ]
        });


}]);
