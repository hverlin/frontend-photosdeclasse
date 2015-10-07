photosApp.controller('loginPhotographerCtrl', ['$scope', '$state', '$filter', 'UserService',
  function ($scope, $state, $filter, UserService) {

    $scope.UserService = UserService ;

    $scope.login = function () {
      $scope.UserService.login($scope.email, $scope.password)
        .then(function() {
          $state.go("admin.mainClassList");
        })
    };

  }]);