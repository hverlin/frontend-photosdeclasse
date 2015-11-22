photosApp.controller('selectionCtrl', ['$scope', 'groupService', '$filter', 'modalService', '$log',
    function ($scope, groupService, $filter, modalService, $log) {

        $scope.groupService = groupService;

        $scope.newGrpNumber = null;

        $scope.orderView = false;

        $scope.rowSelected = [];

        groupService.getGroups().then(function (data) {
            $scope.rowCollection = data;
        });

        groupService.getOrders().then(function (data) {
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

        $scope.onRowSelected = function (num) {
            var removed = false;
            for(var i = 0; i < $scope.rowSelected.length; i++) {
                if ($scope.rowSelected[i] === num) {
                    _.pull($scope.rowSelected, num);
                    removed = true;
                    break;
                }
            }

            if(!removed) {
                $scope.rowSelected.push(num);
            }
            console.log($scope.rowSelected);
        };

        $scope.deleteGroups = function () {
            var cpt = $scope.rowSelected.length;
            for (var i = 0; i < $scope.rowSelected.length; i++) {
                $scope.groupService.deleteGroups($scope.rowSelected[i]).then(function () {
                    cpt--;
                    if (cpt === 0) {
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

        $scope.showPhotos = function(groupNum){
            groupService.getUploadedPhotos(groupNum).then(function(data){

                var uploadedPhotos = {};
                for(var i = 0; i < data.length; i++){
                    uploadedPhotos[data[i]] = groupService.downloadPhotoByNum(groupNum, data[i]);
                }


                var modalOptions = {
                    headerText: 'Photos du groupe '+groupNum,
                    photos : uploadedPhotos
                };

                modalService.showModal({}, modalOptions)
                    .then(function (result) {
                    });

            })
        };

        $scope.openSettings = function () {

            var modalOptions = {
                closeButtonText: 'Cancel',
                headerText: 'Paramètres'
            };

            modalService.showModal({}, modalOptions)
                .then(function (result) {
                });
        };

        $scope.states = [
            "Pas de photographe",
            "commande en cours",
            "commande terminée"
        ];

    }]);


photosApp.directive('csSelect', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox" ng-click="onRowSelected(row.num)"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });

            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                } else {
                    element.parent().removeClass('st-selected');
                }
            });
        }
    };
});

photosApp.service('modalService', ['$modal',
    function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/app/components/admin/modalSettings.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);
