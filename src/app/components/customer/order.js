photosApp.controller('orderCtrl', function ($scope, $state, $stateParams, customerService) {

    $scope.photos = {};
    $scope.orderInput = {};
    $scope.auth = $stateParams.auth;
    customerService.getCustomerFromAuthToken($scope.auth).then(function (user) {

        $scope.group = user.group.num;
        $scope.email = user.email;

        customerService.getUploadedPhotos($scope.auth).then(function(data){
            for(var i = 0; i < data.length; i++){
                $scope.photos[data[i]] = customerService.downloadPhotoByNum($scope.auth, data[i]);
                $scope.orderInput[data[i]] = 0;
            }
        })
    });

    $scope.totalPhotos = function() {
        var sum = 0;
        for(var nb in $scope.orderInput) {
            sum += $scope.orderInput[nb];
        }
        return sum;
    };

    $scope.totalEuros = function() {
        return 3 * $scope.totalPhotos();
    };

    $scope.submitOrder = function () {
        $state.go("customer.orderCompleted")
    }

});


photosApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<= max; i++)
            input.push(i);
        return input;
    };
});