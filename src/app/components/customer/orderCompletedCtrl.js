photosApp.controller('orderCompletedCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.order = $stateParams.order;
    console.log($scope.order);

    if($scope.order === null) {
        $state.go('auth.authOrder')
    }

    $scope.computeTotal = function(){
        if($scope.order === null) return;
        return config.photoPrice * (
        $scope.order.photo_1 +
        $scope.order.photo_2 +
        $scope.order.photo_3 +
        $scope.order.photo_4 +
        $scope.order.photo_5 +
        $scope.order.photo_6)
    }
}]);
