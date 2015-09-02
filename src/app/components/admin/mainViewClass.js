photosApp.controller('selectionCtrl', ['$scope', 'groupService', '$filter', function ($scope, groupService, $filter) {
  var self = this;

  $scope.groupService = groupService;

  $scope.newGrpNumber = null;

  $scope.orderView = false;

  $scope.rowSelected = [];

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
      });

    });
    $scope.newGrpNumber = '';
  };

  $scope.computeTotal = function () {
    if (!$scope.rowOrderCollection) return;
    var total = 0;

    for (var i = 0; i < $scope.rowOrderCollection.length; i++) {
      for (var j = 0; j < $scope.rowOrderCollection[i].length; j++) {
        total += $scope.rowOrderCollection[i][j];
      }
    }

    return total;
  };

  $scope.onRowSelected = function (row) {

    if (row.isSelected) {
      $scope.rowSelected.push(row);
    } else {
      _.remove($scope.rowSelected, function (element) {
        return element.num === row.num;
      })
    }
  };

  $scope.deleteGroups = function () {
    var cpt =  $scope.rowSelected.length;
    for (var i = 0; i < $scope.rowSelected.length; i++) {
      $scope.groupService.deleteGroups($scope.rowSelected[i].num).then(function(){
        cpt--;
        if(cpt === 0) {
          $scope.groupService.getGroups().then(function (data) {
            $scope.rowCollection = data;
          });
          $scope.groupService.getOrders().then(function (data) {
            $scope.rowOrderCollection = data;
            $scope.rowSelected.length = 0;
          });
        }
      });
    }

  };

  $scope.states = [
    "Pas de photographe",
    "commande en cours",
    "commande terminée"
  ]

}]);