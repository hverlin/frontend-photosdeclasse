photosApp.controller('orderCtrl', function($scope, $state) {

  $scope.photos = [0, 1 ,2,3, 4, 5]

  $scope.createCustomer = function() {
    $scope.customerService.createCustomer($scope.email+"@insa-lyon.fr", Number($scope.groupNumber)).then(
        $state.go("customer.orderOk")
    );
  }

    $scope.submitOrder = function() {
            $state.go("customer.orderCompleted")
    }

});
