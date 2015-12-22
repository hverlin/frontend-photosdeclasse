photosApp.controller('ordersController', ['$scope', 'groupService', '$filter', 'modalService', 'uiGridConstants',
    function ($scope, groupService, $filter, modalService, uiGridConstants) {
        $scope.groupService = groupService;

        $scope.gridOptions = {
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: false,
            showColumnFooter: true,
            fastWatch: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function (gridApi) {
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

        $scope.gridOptions.rowIdentity = function (row) {
            return row.id;
        };
        $scope.gridOptions.getRowIdentity = function (row) {
            return row.id;
        };

        $scope.gridOptions.columnDefs = [
            {name: 'num', displayName: "Groupe"},
            {name: 'photo_1', displayName: "Photo 1", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_2', displayName: "Photo 2", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_3', displayName: "Photo 3", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_4', displayName: "Photo 4", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_5', displayName: "Photo 5", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_6', displayName: "Photo 6", aggregationType: uiGridConstants.aggregationTypes.sum},
            {
                name: 'Total', aggregationType: uiGridConstants.aggregationTypes.sum,
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.photo_1+row.entity.photo_2+row.entity.photo_3+row.entity.photo_4+row.entity.photo_5+row.entity.photo_6}}</div>'
            },
            {
                name: 'Total €', aggregationType: uiGridConstants.aggregationTypes.sum,
                cellTemplate: '<div class="ui-grid-cell-contents">{{3*(row.entity.photo_1+row.entity.photo_2+row.entity.photo_3+row.entity.photo_4+row.entity.photo_5+row.entity.photo_6)}}€</div>'
            }
        ];

        groupService.getOrders().then(function (data) {
            $scope.gridOptions.data = data;
        });


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


