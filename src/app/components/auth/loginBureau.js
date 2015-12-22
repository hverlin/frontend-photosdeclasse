photosApp.controller('loginBureauCtrl', ['$scope', '$state', '$filter', 'UserService',
  function ($scope, $state, $filter, UserService) {

    $scope.UserService = UserService ;

    $scope.login = function () {
      $scope.UserService.login('grainesdimages@gmail.com', $scope.password)
        .then(function() {
        $state.go("admin.detailsClasses")
      })
    };

  }]);