photosApp.controller('ordersController', ['$scope', 'groupService', '$filter', 'uiGridConstants', 'i18nService', 'uiGridGroupingConstants',
    function($scope, groupService, $filter, uiGridConstants, i18nService, uiGridGroupingConstants) {
        $scope.groupService = groupService;
        i18nService.setCurrentLang('fr');

        $scope.gridOptions = {
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: false,
            showColumnFooter: true,
            fastWatch: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerDataChangeCallback(function() {
                    try{
                        $scope.gridApi.treeBase.expandAllRows();
                    } catch(e) {
                        
                    }
                });
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function(rowChanged) {
                    if (typeof(rowChanged.treeLevel) !== 'undefined' && rowChanged.treeLevel > -1) {
                        // this is a group header
                        var children = $scope.gridApi.treeBase.getRowChildren(rowChanged);
                        children.forEach(function(child) {
                            if (rowChanged.isSelected) {
                                $scope.gridApi.selection.selectRow(child.entity);
                            }
                            else {
                                $scope.gridApi.selection.unSelectRow(child.entity);
                            }
                        });
                    }
                });
            }
        };

        // return the height of the grid
        $scope.getHeight = util.gridHeight;

        $scope.gridOptions.rowIdentity = function(row) {
            return row.id;
        };
        $scope.gridOptions.getRowIdentity = function(row) {
            return row.id;
        };


        $scope.gridOptions.columnDefs = [{
            name: 'laniere',
            displayName: "Lanière",
            width: '7%',
            enableColumnMenu: false,
            enableSorting: false,
            grouping: {
                groupPriority: 0
            }
        }, {
            name: 'num',
            displayName: "Groupe",
            suppressRemoveSort: true,
            enableColumnMenu: false,
            sortingAlgorithm: util.naturalSort,
            filter: {
                condition: uiGridConstants.filter.EXACT
            },
            sort: {
                direction: uiGridConstants.ASC
            }
        }, {
            name: 'photo_1',
            displayName: "Photo 1",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: 'photo_2',
            displayName: "Photo 2",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: 'photo_3',
            displayName: "Photo 3",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: 'photo_4',
            displayName: "Photo 4",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: 'photo_5',
            displayName: "Photo Promo 1",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: 'photo_6',
            displayName: "Photo Promo 2",
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: "total",
            displayName: 'Total',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD }}</div>'
        }, {
            name: "total_eur",
            displayName: 'Total €',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents">{{ COL_FIELD | currency }}</div><div ng-if="!row.entity.num" class="ui-grid-cell-contents" style="color:lightgray">{{ COL_FIELD}}</div>'

        }, {
            name: 'Actions',
            enableColumnMenu: false,
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div ng-if="row.entity.num" class="ui-grid-cell-contents"><a class="btn btn-primary btn-sm" href=\"\" ui-sref="admin.orderGroup({num: row.entity.num})">Voir le détail</a></div>'
        }];


        groupService.getOrders().then(function(data) {
            $scope.gridOptions.data = data;
        });

    }
]);
