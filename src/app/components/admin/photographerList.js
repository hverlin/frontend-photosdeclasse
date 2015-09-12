photosApp.controller('photographerListCtrl', ['$scope', 'photographerService', '$filter', 'modalService', '$log',
  function ($scope, photographerService, $filter, modalService, $log) {
    var self = this;

    photographerService.getPhotographers().then(function (data) {
      $scope.rowCollection = data;
    });

    $scope.displayedCollection = [].concat($scope.rowCollection);


  }]);


