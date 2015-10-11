photosApp.controller('changePasswordCtrl', ['$scope', '$state', '$filter', 'UserService', '$stateParams',
    function ($scope, $state, $filter, UserService, $stateParams) {

        $scope.UserService = UserService;
        $scope.changePassword = function () {
            $scope.UserService.changePassword($stateParams.param1, $scope.password1)
                .then(function() {
                    $state.go("auth.authPhotographe");
                })
        };
    }]);