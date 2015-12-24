photosApp.controller('loginOrderCtrl', ['$scope', '$state', 'groupService', '$filter', 'customerService', 'Notification','modal',
    function ($scope, $state, groupService, $filter, customerService, Notification, modal) {
    var self = this;

    $scope.groupService = groupService;
    $scope.customerService = customerService;

    $scope.groups = [];
    $scope.groupNumber = '';
    $scope.email = '';

    $scope.createCustomer = function() {
        $scope.customerService.createCustomer($scope.email+"@insa-lyon.fr", $scope.groupNumber).then(function() {
            Notification.success("Un email vient de t'être envoyé ! ");
            var email = {};
            email.email = $scope.email+"@insa-lyon.fr";
            modal.activate(email);
            }
        );
    };

    groupService.getGroups().then(function (data) {
        $scope.groups = data;
    });

}]);

