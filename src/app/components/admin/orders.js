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



        var myAwesomeSortFn = function (a, b) {
            var NUMBER_GROUPS = /(-?\d*\.?\d+)/g;

            var aa = String(a).split(NUMBER_GROUPS),
                bb = String(b).split(NUMBER_GROUPS),
                min = Math.min(aa.length, bb.length);

            for (var i = 0; i < min; i++) {
                var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
                    y = parseFloat(bb[i]) || bb[i].toLowerCase();
                if (x < y) return -1;
                else if (x > y) return 1;
            }

            return 0;
        };

        $scope.gridOptions.columnDefs = [
            {name: 'num', displayName: "Groupe",
                sortingAlgorithm: myAwesomeSortFn,
                filter: {
                condition: uiGridConstants.filter.EXACT
            },  sort: {
                direction: uiGridConstants.ASC
            } },
            {name: 'photo_1', displayName: "Photo 1", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_2', displayName: "Photo 2", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_3', displayName: "Photo 3", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_4', displayName: "Photo 4", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_5', displayName: "Photo 5", aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'photo_6', displayName: "Photo 6", aggregationType: uiGridConstants.aggregationTypes.sum},
            {
                name: 'Total', aggregationType: uiGridConstants.aggregationTypes.sum,  footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getTotal()}}</div>',
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.photo_1+row.entity.photo_2+row.entity.photo_3+row.entity.photo_4+row.entity.photo_5+row.entity.photo_6}}</div>'
            },
            {
                name: 'Total €', aggregationType: uiGridConstants.aggregationTypes.sum,  footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">{{grid.appScope.getTotal() * 3}}€ </div>',
                cellTemplate: '<div class="ui-grid-cell-contents">{{3*(row.entity.photo_1+row.entity.photo_2+row.entity.photo_3+row.entity.photo_4+row.entity.photo_5+row.entity.photo_6)}}€</div>'
            },
            { field: 'Actions', enableColumnMenu: false },

            {name: 'Actions', enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href=\"\" ng-click=grid.appScope.showOrderforGroup(row.entity.num)>Voir le détail</a></span></div>'}
        ];

        groupService.getOrders().then(function (data) {
            $scope.gridOptions.data = data;
        });


        $scope.getTotal = function() {
            var total = 0;
            for(var i = 2; i < 8; i++) {
                total += $scope.gridApi.grid.columns[i].getAggregationValue();
            }
            return total;
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


