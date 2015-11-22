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
        var orders = {};

        if($scope.orderInput[0]) orders.photo_1 = $scope.orderInput[0];
        if($scope.orderInput[1]) orders.photo_2 = $scope.orderInput[1];
        if($scope.orderInput[2]) orders.photo_3 = $scope.orderInput[2];
        if($scope.orderInput[3]) orders.photo_4 = $scope.orderInput[3];
        if($scope.orderInput[4]) orders.photo_5 = $scope.orderInput[4];
        if($scope.orderInput[5]) orders.photo_6 = $scope.orderInput[5];

        customerService.createOrder($scope.auth, orders).then(function(order){
            $state.go("customer.orderCompleted", {order: order});
        });
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