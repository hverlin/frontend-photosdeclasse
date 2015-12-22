photosApp.controller('photographerListCtrl', ['$scope', 'photographerService', '$filter', 'modalService', 'uiGridConstants',
    function ($scope, photographerService, $filter, modalService, uiGridConstants) {

        $scope.gridOptions = {
            enableColumnResizing : true,
            enableFiltering : true,
            enableGridMenu : true,
            showGridFooter : false,
            showColumnFooter : true,
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
            { name:'email', displayName : "Photographe"},
             {name: 'Actions', enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href=\"\" ng-click=grid.appScope.showPhotos(row.entity.num)>Voir les photos</a></span></div>'}
        ];

        photographerService.getPhotographers().then(function (data) {
            $scope.gridOptions.data = data;
        });


        $scope.addPhotographer = function () {
            var photographer = prompt("Nouveau Photographe", "email@email.com");
            if (photographer != null) {
                photographerService.addPhotographer(photographer)
                    .then(function (data) {
                        $scope.gridOptions.data = data;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    });
            }

        };


        $scope.addGrp = function () {
            var group = prompt("Numéro du groupe", "groupe");
            if (group != null) {
                $scope.groupService.addGroup(group).then(function () {
                    $scope.groupService.getOrders().then(function (data) {
                        $scope.gridOptions.data = data;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    });
                });
            }
        };

        $scope.removePhotographer = function () {
            var photographers = $scope.gridApi.selection.getSelectedRows();

            for(var i = 0; i < photographers.length; i++) {
                if(confirm("supprimer photographe "+photographers[i].email+" ?")){
                    photographerService.removePhotographer(photographers[i].email)
                        .then(function (data) {
                            $scope.gridOptions.data = data;
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        });
                }
            }
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


