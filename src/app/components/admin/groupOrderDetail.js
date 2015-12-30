photosApp.controller('ordersGroupController', ['$scope', 'groupService', '$filter', 'uiGridConstants', 'i18nService', '$stateParams', '$uibModal',
    function($scope, groupService, $filter, uiGridConstants, i18nService, $stateParams, $uibModal) {
        $scope.groupService = groupService;
        i18nService.setCurrentLang('fr');

        $scope.group = $stateParams.num;

        $scope.gridOptions = {
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: false,
            showColumnFooter: true,
            fastWatch: false,
            enableGroupHeaderSelection: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    if (newValue === oldValue) return;
                    groupService.updateOrder(rowEntity.order).then(function() {
                        groupService.getOrderForGroup($scope.group).then(function(data) {
                            $scope.gridOptions.data = data;
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        });
                    });
                    $scope.$apply();
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
            name: 'email',
            displayName: "Etudiant",
            width: "20%",
            enableCellEdit: false,
            sortingAlgorithm: util.naturalSort,
            filter: {
                condition: uiGridConstants.filter.EXACT
            },
            sort: {
                direction: uiGridConstants.ASC
            }
        }, {
            name: "order.updatedAt",
            displayName: "Date de commande",
            type: "date",
            cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD | date:"dd/MM \'-\' HH:mm" }}</div>',
            enableCellEdit: false
        }, {
            name: 'order.photo_1',
            displayName: "Photo 1",
            cellTemplate: 'editTemplate.html',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_2',
            displayName: "Photo 2",
            cellTemplate: 'editTemplate.html',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_3',
            displayName: "Photo 3",
            cellTemplate: 'editTemplate.html',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_4',
            displayName: "Photo 4",
            cellTemplate: 'editTemplate.html',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_5',
            displayName: "Photo 5",
            cellTemplate: 'editTemplate.html',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.photo_6',
            displayName: "Photo 6",
            cellTemplate: 'editTemplate.html',
            aggregationType: uiGridConstants.aggregationTypes.sum
        }, {
            name: 'order.total',
            displayName: 'Total',
            enableCellEdit: false,
            aggregationType: uiGridConstants.aggregationTypes.sum,
        }, {
            name: 'order.total_eur',
            enableCellEdit: false,
            displayName: 'Total €',
            cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD | currency }}</div>',
            aggregationType: uiGridConstants.aggregationTypes.sum,
        }];

        groupService.getOrderForGroup($scope.group).then(function(data) {
            $scope.gridOptions.data = data;
        });

        $scope.addOrder = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/app/components/admin/modalAddOrder.html',
                controller: 'addOrderController',
            });

            modalInstance.result.then(function(order) {
                order.group = $scope.group;
                $scope.groupService.addOrder(order).then(function(data) {
                    $scope.gridOptions.data = data;
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    location.reload();
                });
            });
        };

        $scope.deleteOrder = function() {
            var client = $scope.gridApi.selection.getSelectedRows();
            for (var i = 0; i < client.length; i++) {
                if (confirm("supprimer le client " + client[i].email + " ?")) {
                    $scope.groupService.deleteCustomer(client[i].email).then(function() {
                        groupService.getOrderForGroup($scope.group).then(function(data) {
                            $scope.gridOptions.data = data;
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        });
                    });
                }
            }
        };

        $scope.copyEmail = function() {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                text += groups[i].email + ", ";
            }
            window.prompt("Copier : Ctrl+C, Entrer", text);

        };

    }
]);


photosApp.controller('addOrderController', function($scope, $uibModalInstance) {

    $scope.order = {
        email: "",
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0,
        p5: 0,
        p6: 0
    };

    $scope.formValid = function() {
        var patt = new RegExp("^[a-z\-]+\.[a-z\-]+");
        var emailok = patt.test($scope.order.email);
        return (emailok && $scope.order.email !== undefined && $scope.order.email !== "" && $scope.order.p1 >= 0 && $scope.order.p2 >= 0 && $scope.order.p3 >= 0 && $scope.order.p4 >= 0 && $scope.order.p5 >= 0 && $scope.order.p6 >= 0);
    };

    $scope.ok = function() {
        if ($scope.order.email !== undefined && $scope.order.email !== "" && $scope.order.p1 >= 0 && $scope.order.p2 >= 0 && $scope.order.p3 >= 0 && $scope.order.p4 >= 0 && $scope.order.p5 >= 0 && $scope.order.p6 >= 0) {
            $scope.order.email += "@insa-lyon.fr";
            $uibModalInstance.close($scope.order);
        }

    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});