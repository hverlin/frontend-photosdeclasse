photosApp.controller('ordersListCtrl', ['$scope', 'customerService', 'uiGridConstants', 'i18nService', '$stateParams', '$state', 'uiGridExporterConstants',
    function ($scope, customerService, uiGridConstants, i18nService, $stateParams, $state, uiGridExporterConstants) {
        $scope.customerService = customerService;
        i18nService.setCurrentLang('fr');

        $scope.auth = $stateParams.auth;

        if ($scope.auth === undefined) {
            $state.go("auth.authOrder");
        }

        $scope.gridOptions = {
            exporterPdfDefaultStyle: {
                fontSize: 10,
                bold: false
            },
            exporterPdfTableStyle: {},
            exporterPdfTableHeaderStyle: {
                fontSize: 10,
                bold: true,
                color: 'red'
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'A4',
            exporterPdfMaxGridWidth: 420,
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {
                    fontSize: 15,
                    bold: true,
                    margin: [10, 10, 10, 10]
                };
                docDefinition.styles.footerStyle = {
                    fontSize: 10,
                    bold: true
                };
                return docDefinition;
            },
            exporterPdfHeader: {
                text: "Récapitulatif des commandes",
                style: 'headerStyle'
            },
            exporterFieldCallback: function (grid, row, col, value) {
                if (col.name === 'order.total_eur') {
                    value = value + '€';
                }
                return value;
            },
            enableColumnResizing: true,
            enableFiltering: false,
            showGridFooter: false,
            showColumnFooter: true,
            fastWatch: false,
            enableGroupHeaderSelection: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };


        // return the height of the grid
        $scope.getHeight = util.gridHeight;

        $(window).on("resize.doResize", _.debounce(function () {
            //  alert(window.innerWidth);

            $scope.$apply(function () {
                if (window.innerWidth < 700) {
                    $scope.gridApi.grid.columns[2].hideColumn();
                    $scope.gridApi.grid.columns[3].hideColumn();
                    $scope.gridApi.grid.columns[4].hideColumn();
                    $scope.gridApi.grid.columns[5].hideColumn();
                    $scope.gridApi.grid.columns[6].hideColumn();
                    $scope.gridApi.grid.columns[7].hideColumn();
                }
                else {
                    $scope.gridApi.grid.columns[2].showColumn();
                    $scope.gridApi.grid.columns[3].showColumn();
                    $scope.gridApi.grid.columns[4].showColumn();
                    $scope.gridApi.grid.columns[5].showColumn();
                    $scope.gridApi.grid.columns[6].showColumn();
                    $scope.gridApi.grid.columns[7].showColumn();
                }
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

            });
        }, 10));

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });


        $scope.gridOptions.rowIdentity = function (row) {
            return row.id;
        };
        $scope.gridOptions.getRowIdentity = function (row) {
            return row.id;
        };

        $scope.gridOptions.columnDefs = [{
            name: 'name',
            displayName: "Nom",
            enableColumnMenu: false,
            sort: {
                direction: uiGridConstants.ASC
            }
        }, {
            name: 'surname',
            displayName: "Prénom",
            enableColumnMenu: false

        }, {
            name: 'order.photo_1',
            displayName: "Photo 1",
            enableColumnMenu: false,
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_2',
            displayName: "Photo 2",
            enableColumnMenu: false,
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_3',
            displayName: "Photo 3",
            enableColumnMenu: false,

            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_4',
            displayName: "Photo 4",
            enableColumnMenu: false,
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_5',
            displayName: "Photo 5",
            enableColumnMenu: false,
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_6',
            displayName: "Photo 6",
            enableColumnMenu: false,
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.total',
            displayName: 'Total',
            enableColumnMenu: false,
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.total_eur',
            displayName: 'Total €',
            enableColumnMenu: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD | currency }}</div>',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }];

        customerService.getGroupList($scope.auth).then(function (data) {
            $scope.gridOptions.data = data;
            if (window.innerWidth < 700) {
                $scope.gridApi.grid.columns[2].hideColumn();
                $scope.gridApi.grid.columns[3].hideColumn();
                $scope.gridApi.grid.columns[4].hideColumn();
                $scope.gridApi.grid.columns[5].hideColumn();
                $scope.gridApi.grid.columns[6].hideColumn();
                $scope.gridApi.grid.columns[7].hideColumn();
            }
            else {
                $scope.gridApi.grid.columns[2].showColumn();
                $scope.gridApi.grid.columns[3].showColumn();
                $scope.gridApi.grid.columns[4].showColumn();
                $scope.gridApi.grid.columns[5].showColumn();
                $scope.gridApi.grid.columns[6].showColumn();
                $scope.gridApi.grid.columns[7].showColumn();
            }
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        });


        $scope.export = function () {
            $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
        };


        customerService.getCustomerFromAuthToken($scope.auth).then(function (user) {
            $scope.group = user.group.num;
            $scope.email = user.email;
        });

    }
]);
