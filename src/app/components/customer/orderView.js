photosApp.controller('orderCtrl', function($scope, $state, $stateParams, customerService, SweetAlert) {

    $scope.ordersOpen = false;
    $scope.photos = {};
    $scope.orderInput = {};

    $scope.previousOrders = {};

    $scope.auth = $stateParams.auth;

    if ($scope.auth === undefined) {
        $state.go("auth.authOrder");
    }

    customerService.getCustomerFromAuthToken($scope.auth).then(function(user) {

        $scope.group = user.group.num;
        $scope.email = user.email;
        $scope.ordersOpen = user.group.ordersOpen;
        customerService.getUploadedPhotos($scope.auth).then(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.photos[data[i]] = customerService.downloadPhotoByNum($scope.auth, data[i]);
                $scope.orderInput[data[i]] = 0;
            }

            if (user.order) {
                $scope.modifyOrder = true;

                $scope.orderInput[0] = user.order.photo_1;
                $scope.orderInput[1] = user.order.photo_2;
                $scope.orderInput[2] = user.order.photo_3;
                $scope.orderInput[3] = user.order.photo_4;
                $scope.orderInput[4] = user.order.photo_5;
                $scope.orderInput[5] = user.order.photo_6;

                $scope.previousOrders[0] = user.order.photo_1;
                $scope.previousOrders[1] = user.order.photo_2;
                $scope.previousOrders[2] = user.order.photo_3;
                $scope.previousOrders[3] = user.order.photo_4;
                $scope.previousOrders[4] = user.order.photo_5;
                $scope.previousOrders[5] = user.order.photo_6;
            }
        });

    });

    $scope.photoName = {
        "0": "Photo 1",
        "1": "Photo 2",
        "2": "Photo 3",
        "3": "Photo 4",
        "4": "Photo 5",
        "5": "Photo 6"
    };

    $scope.totalPhotos = function() {
        var sum = 0;
        for (var nb in $scope.orderInput) {
            sum += $scope.orderInput[nb];
        }
        return sum;
    };

    $scope.totalEuros = function() {
        return 3 * $scope.totalPhotos();
    };

    $scope.canSubmitOrder = function() {

        if ($scope.previousOrders[0] == $scope.orderInput[0] &&
            $scope.previousOrders[1] == $scope.orderInput[1] &&
            $scope.previousOrders[2] == $scope.orderInput[2] &&
            $scope.previousOrders[3] == $scope.orderInput[3] &&
            $scope.previousOrders[4] == $scope.orderInput[4] &&
            $scope.previousOrders[5] == $scope.orderInput[5]) {
            return false;
        }
        return true;

    };

    $scope.submitOrder = function() {
        var orders = {};

        if ($scope.orderInput[0]) orders.photo_1 = $scope.orderInput[0];
        if ($scope.orderInput[1]) orders.photo_2 = $scope.orderInput[1];
        if ($scope.orderInput[2]) orders.photo_3 = $scope.orderInput[2];
        if ($scope.orderInput[3]) orders.photo_4 = $scope.orderInput[3];
        if ($scope.orderInput[4]) orders.photo_5 = $scope.orderInput[4];
        if ($scope.orderInput[5]) orders.photo_6 = $scope.orderInput[5];


        customerService.createOrder($scope.auth, orders).then(function() {
            SweetAlert.swal("Commande enregistrée !", "Un mail avec le résumé de ta commande t'a été envoyé. Si tu t'es trompé(e), tu peux modifier ta commande. Dans le cas contraire, tu peux fermer la page !", "success");
            $scope.modifyOrder = true;

            $scope.previousOrders[0] = $scope.orderInput[0];
            $scope.previousOrders[1] = $scope.orderInput[1];
            $scope.previousOrders[2] = $scope.orderInput[2];
            $scope.previousOrders[3] = $scope.orderInput[3];
            $scope.previousOrders[4] = $scope.orderInput[4];
            $scope.previousOrders[5] = $scope.orderInput[5];

        }, function() {
            SweetAlert.swal("Une erreur est survenue durant l'enregistrement de ta commande. Tu peux réessayer ou nous contacter si l'erreur se reproduit.", "error");
        });
    };
});


photosApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i = min; i <= max; i++)
            input.push(i);
        return input;
    };
});