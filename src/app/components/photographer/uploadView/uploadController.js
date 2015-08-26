photosApp.controller('uploadCtrl', function($scope, FileUploader) {
  $scope.uploader = new FileUploader();

  $scope.uploader.url = "https://backend-graines-hverlin.c9.io/v1/photo/";
  $scope.uploader.queueLimit = 3;

  $scope.uploader.onAfterAddingFile =  function(item) {
    item.formData = [{number : $scope.uploader.getIndexOfItem(item)}]
  };

  $scope.photoNumbers = [1,2,3,4,5,6];

  $scope.uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

});

// FILTERS

