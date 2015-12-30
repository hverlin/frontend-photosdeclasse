photosApp.controller('uploadCtrlAdmin', function($scope, FileUploader, $stateParams, $timeout, AuthService, groupService, Notification) {
    $scope.uploader = new FileUploader();
    $scope.group = $stateParams.num;

    $scope.uploader.url = config.api.url + "/photo"; //?group=";+$scope.group;
    $scope.uploader.queueLimit = 6;

    $scope.uploader.onAfterAddingFile = function(item) {

        if ((item.file.size / 1024 / 1024) > 5) {
            item.remove();
            Notification.error("Taille de la photo supérieure à 5Mo. Réduisez sa taille.");
            return;
        }

        for (var i in $scope.uploader.queue) {
            if ($scope.uploader.queue[i].num === item.num &&
                $scope.uploader.queue[i].file.name !== item.file.name) {
                $scope.uploader.queue[i].remove();
            }
        }

        for (var i in $scope.uploader.queue) {
            if ($scope.uploader.queue[i].file.name === item.file.name &&
                $scope.uploader.queue[i].num !== item.num) {
                Notification.error("Attention une photo identique a déjà été placée dans la file d'attente !");
                item.remove();
            }
        }
        item.formData = [{
            groupNumber: $scope.group
        }, {
            number: item.num
        }];
    };

    $scope.photos = [];
    for (var i = 0; i < 6; i++) {
        $scope.photos.push({
            num: i,
            url: config.api.url + '/photo?grpnumber=' +
                $scope.group + '&number=' + i + '&auth=' + AuthService.getToken()
        });
    }

    $scope.uploader.onCompleteAll = function() {
        $timeout(function() {
            $scope.photos = [];
            for (var i = 0; i < 6; i++) {
                $scope.photos.push({
                    num: i,
                    url: config.api.url + '/photo?grpnumber=' +
                        $scope.group + '&number=' + i + '&auth=' + AuthService.getToken()
                });
            }
        }, 2000);
    };

    $scope.uploadAll = function() {
        $scope.uploader.uploadAll();
    };

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|jpeg|'.indexOf(type) !== -1;
        }
    });


    $scope.deletePhoto = function(num) {
        groupService.deletePhoto(num, $scope.group).then(function() {
            location.reload();
        });
    };


});

// FILTERS
