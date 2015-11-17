photosApp.controller('uploadCtrl', function($scope, FileUploader, $stateParams) {
  $scope.uploader = new FileUploader();
  $scope.group = $stateParams.num;

  $scope.uploader.url = "https://backend-graines-hverlin.c9.io/v1/photo?group="+$scope.group;
  $scope.uploader.queueLimit = 6;

  $scope.uploader.onAfterAddingFile =  function(item) {
    item.formData = [{number : $scope.uploader.getIndexOfItem(item)}]
  };

  $scope.photoNumbers = [1,2,3,4,5,6];

  $scope.uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|jpeg|'.indexOf(type) !== -1;
    }
  });

});

// FILTERS

