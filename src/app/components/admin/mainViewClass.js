photosApp.controller('selectionCtrl', ['$scope', 'groupService', '$filter', function ($scope, groupService, $filter) {
  var self = this;

  $scope.groupService = groupService;

  $scope.newGrpNumber = null;


  $scope.groupService.getGroups().then(function() {
    $scope.rowCollection = $scope.groupService.groups;
  });

  $scope.displayedCollection = [].concat($scope.groupService.groups);


  $scope.addGrp = function() {
    $scope.groupService.addGroup($scope.newGrpNumber).then(function() {
      $scope.rowCollection = $scope.groupService.groups;
    });

  };

  $scope.states = [
    "Pas de photographe",
    "commande en cours",
    "commande terminée"
  ]
}]);