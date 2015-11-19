photosApp.controller('uploadCtrl', function($scope, FileUploader, $stateParams, $timeout, AuthService) {
    $scope.uploader = new FileUploader();
    $scope.group = $stateParams.num;

    $scope.uploader.url = config.api.url+"/photo";//?group=";+$scope.group;
    $scope.uploader.queueLimit = 6;

    $scope.uploader.onAfterAddingFile =  function(item) {
        console.log(item)
        for(var i in $scope.uploader.queue){
            if($scope.uploader.queue[i].num === item.num &&
                $scope.uploader.queue[i].file.name !== item.file.name ){
                $scope.uploader.queue[i].remove();
            }
        }
        item.formData = [{groupNumber: $scope.group},{number : item.num }];
    };

    $scope.photos = [];
    for(var i = 0 ; i < 6 ; i++){
        $scope.photos.push({num : i,
            url: config.api.url+'/photo?grpnumber='+
            $scope.group+'&number='+i+'&auth='+AuthService.getToken()});
    }

    $scope.uploader.onCompleteAll = function(){
        $timeout(function () {
            $scope.photos = [];
            for(var i = 0 ; i < 6 ; i++){
                $scope.photos.push({num : i,
                    url: config.api.url+'/photo?grpnumber='+
                    $scope.group+'&number='+i+'&auth='+AuthService.getToken()});
            }
        }, 2000);
    };

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|jpeg|'.indexOf(type) !== -1;
        }
    });



});

// FILTERS

