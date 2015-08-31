photosApp.controller('selectionCtrl', ['$scope', 'groupService', '$filter', function ($scope, groupService, $filter) {
  var self = this;

  $scope.groupService = groupService;

  $scope.newGrpNumber = null;

  $scope.orderView = false;

  $scope.groupService.getGroups().then(function (data) {
    $scope.rowCollection = data;
  });

  $scope.groupService.getOrders().then(function (data) {
    $scope.rowOrderCollection = data;
  });

  $scope.displayedCollection = [].concat($scope.rowCollection);
  $scope.displayedOrderCollection = [].concat($scope.rowOrderCollection);

  $scope.addGrp = function () {
    $scope.groupService.addGroup($scope.newGrpNumber).then(function (data) {
      $scope.rowCollection = data;

      $scope.groupService.getOrders().then(function (data) {
        $scope.rowOrderCollection = data;
        console.log($scope.rowOrderCollection);
      });

    });
    $scope.newGrpNumber = '';
  };

  $scope.computeTotal = function() {

    var total = 0;

    for(var  i = 0; i < $scope.rowOrderCollection.length; i++) {
      for(var j = 0; j < $scope.rowOrderCollection[i].length ; j++) {
        total += $scope.rowOrderCollection[i][j];
      }
    }

    return total;
  };

  $scope.states = [
    "Pas de photographe",
    "commande en cours",
    "commande terminée"
  ]

}]);