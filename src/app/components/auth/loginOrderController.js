photosApp.controller('loginOrderCtrl', ['$scope', '$state', 'groupService', '$filter', 'customerService', 'Notification',
    function ($scope, $state, groupService, $filter, customerService, Notification) {
    var self = this;

    $scope.groupService = groupService;
    $scope.customerService = customerService;

    $scope.groups = [];
    $scope.groupNumber = '';
    $scope.email = '';

    $scope.createCustomer = function() {
        $scope.customerService.createCustomer($scope.email+"@insa-lyon.fr", $scope.groupNumber).then(function() {
            Notification.success("Un email vient de t'être envoyé ! ")
            //$state.go("customer.order")
            }
        );
    };

    groupService.getGroups().then(function (data) {
        $scope.groups = data;
    });

}]);