photosApp.controller('detailsClasses', ['$scope', 'groupService', '$filter', 'modalService', 'uiGridConstants',
    function ($scope, groupService, $filter, modalService, uiGridConstants) {
        $scope.groupService = groupService;

        $scope.gridOptions = {
            enableColumnResizing : true,
            enableFiltering : true,
            enableGridMenu : true,
            showGridFooter : false,
            showColumnFooter : false,
            fastWatch : false,
            enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    var msg = 'row selected ' + row.isSelected;
                    console.log(msg);
                });
            }
        };

        // return the height of the grid
        $scope.getHeight = function () {
            return window.innerHeight - 67;
        };

        $scope.gridOptions.rowIdentity = function(row) {
            return row.id;
        };
        $scope.gridOptions.getRowIdentity = function(row) {
            return row.id;
        };

        $scope.gridOptions.columnDefs = [
            { name:'num', displayName : "Groupe"},
            { name:'email', displayName:'Email Responsable'},
            {name: 'phone', displayName:'Téléphone Responsable'},
            { name:'status'},
            {name: 'photographer.email', displayName: 'Photographe'},
            {name: 'Actions', enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href=\"\" ng-click=grid.appScope.showPhotos(row.entity.num)>Voir les photos</a></span></div>'}

        ];

        groupService.getGroups().then(function (data) {
            $scope.gridOptions.data = data;
        });


        $scope.addGrp = function () {
            var group = prompt("Numéro du groupe", "groupe");
            if (group != null) {
                $scope.groupService.addGroup(group).then(function (data) {
                    $scope.gridOptions.data = data;
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                });
            }
        };

        $scope.deleteGroups = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            for (var i = 0; i < groups.length; i++) {
                if (confirm("supprimer groupe " + groups[i].num + " ?")) {
                    $scope.groupService.deleteGroups(groups[i].num).then(function (grpdeleted) {
                        groupService.getGroups().then(function (data) {
                            $scope.gridOptions.data = data;
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        });
                    });
                }
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
