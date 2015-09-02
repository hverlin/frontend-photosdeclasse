photosApp.controller('loginOrderCtrl', ['$scope', '$state', 'groupService', '$filter', 'customerService', function ($scope, $state, groupService, $filter, customerService) {
  var self = this;

  $scope.groupService = groupService;
  $scope.customerService = customerService;

  $scope.groups = [];
  $scope.groupNumber = '';
  $scope.email = '';
  $scope.groupService.getGroups().then(function(data) {
    $scope.groups = data;
  });

  $scope.createCustomer = function() {
    $scope.customerService.createCustomer($scope.email+"@insa-lyon.fr", Number($scope.groupNumber)).then(
      $state.go("customer.order")
    );
  }

}]);