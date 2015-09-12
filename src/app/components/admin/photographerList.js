photosApp.controller('photographerListCtrl', ['$scope', 'photographerService', '$filter', 'modalService', '$log',
  function ($scope, photographerService, $filter, modalService, $log) {
    var self = this;

    photographerService.getPhotographers().then(function (data) {
      $scope.rowCollection = data;
    });

    $scope.displayedCollection = [].concat($scope.rowCollection);


    $scope.addPhotographer = function () {
      photographerService.addPhotographer($scope.newPhotographer).then(function (data) {
        $scope.rowCollection = data;

        photographerService.getPhotographers().then(function (data) {
          $scope.rowOrderCollection = data;
        });

      });
      $scope.newPhotographer = '';
    };

  }]);


