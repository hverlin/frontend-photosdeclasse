photosApp.controller('detailsClasses', ['$scope', 'groupService', '$filter', 'uiGridConstants', 'SweetAlert', 'i18nService', '$uibModal', '$timeout', 'AuthService',
    function ($scope, groupService, $filter, uiGridConstants, SweetAlert, i18nService, $uibModal, $timeout, AuthService) {
        $scope.groupService = groupService;

        i18nService.setCurrentLang('fr');
        $scope.gridOptions = {
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: false,
            showColumnFooter: false,
            fastWatch: false,
            enableCellEdit: false,
            rowHeight: 35,
            enableGroupHeaderSelection: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerDataChangeCallback(function () {
                    try {
                        $scope.gridApi.treeBase.expandAllRows();
                    }
                    catch (e) {}
                });
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (rowChanged) {
                    console.log(rowChanged)
                    if (typeof (rowChanged.treeLevel) !== 'undefined' && rowChanged.treeLevel > -1) {
                        // this is a group header
                        var children = $scope.gridApi.treeBase.getRowChildren(rowChanged);
                        children.forEach(function (child) {
                            if (rowChanged.isSelected) {
                                $scope.gridApi.selection.selectRow(child.entity);
                            }
                            else {
                                $scope.gridApi.selection.unSelectRow(child.entity);
                            }
                        });
                    }
                });

                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue === oldValue) return;
                    if (colDef.name === 'status') {
                        groupService.updateGroup(rowEntity.num, null, null, newValue);
                    }
                    else if (colDef.name === 'emailResponsable') {
                        groupService.updateGroup(rowEntity.num, newValue, null, null);
                    }
                    else if (colDef.name === 'phoneNumber') {
                        groupService.updateGroup(rowEntity.num, null, newValue, null);
                    }
                    $scope.$apply();
                });
            }
        };

        // return the height of the grid
        $scope.getHeight = util.gridHeight;

        $scope.gridOptions.rowIdentity = function (row) {
            return row.id;
        };

        $scope.gridOptions.getRowIdentity = function (row) {
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
                width: '5%',
                suppressRemoveSort: true,
                enableColumnMenu: false,
                filter: {
                    condition: uiGridConstants.filter.EXACT
                },
                sortingAlgorithm: util.naturalSort,
                sort: {
                    direction: uiGridConstants.ASC
                }
            }, {
                name: 'emailResponsable',
                displayName: 'Email Responsable',
                enableColumnMenu: false,
                enableCellEdit: true,
                cellTemplate: 'editTemplate.html'
            }, {
                name: 'phoneNumber',
                displayName: 'Téléphone Responsable',
                enableCellEdit: true,
                enableColumnMenu: false,
                cellTemplate: 'editTemplate.html'
            }, {
                field: 'status',
                enableColumnMenu: false,
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                        value: 'Pas de photographe',
                        label: 'Pas de photographe'
                    }, {
                        value: 'Groupe choisi',
                        label: 'Groupe choisi'
                    }, {
                        value: 'Groupe contacté',
                        label: 'Groupe contacté'
                    }, {
                        value: 'Rendez-vous pris',
                        label: 'Rendez-vous pris'
                    }, {
                        value: 'Photos prises',
                        label: 'Photos prises'
                    }, {
                        value: 'Photos uploadées',
                        label: 'Photos uploadées'
                    }, {
                        value: 'Commande en cours',
                        label: 'Commande en cours'
                    }, {
                        value: 'Commande terminée',
                        label: 'Commande terminée'
                    }, {
                        value: 'Argent récupéré',
                        label: 'Argent récupéré'
                    }, {
                        value: 'Achat des photos',
                        label: 'Achat des photos'
                    }, {
                        value: 'Terminé',
                        label: 'Terminé'
                    }]
                }
            }, {
                name: 'status',
                displayName: 'Etat',
                enableColumnMenu: false,
                enableCellEdit: true,
                cellTemplate: 'editTemplate.html',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownValueLabel: 'status',
                editDropdownOptionsArray: [{
                    id: 'Pas de photographe',
                    status: 'Pas de photographe'
                }, {
                    id: 'Groupe choisi',
                    status: 'Groupe choisi'
                }, {
                    id: 'Groupe contacté',
                    status: 'Groupe contacté'
                }, {
                    id: 'Rendez-vous pris',
                    status: 'Rendez-vous pris'
                }, {
                    id: 'Photos prises',
                    status: 'Photos prises'
                }, {
                    id: 'Photos uploadées',
                    status: 'Photos uploadées'
                }, {
                    id: 'Commande terminée',
                    status: 'Commande terminée'
                }, {
                    id: 'Argent récupéré',
                    status: 'Argent récupéré'
                }, {
                    id: 'Achat des photos',
                    status: 'Achat des photos'
                }, {
                    id: 'Terminé',
                    status: 'Terminé'
                }]
            }, {
                name: 'photographer.email',
                displayName: 'Photographe',
                enableColumnMenu: false
            }, {
                name: 'Actions',
                enableFiltering: false,
                enableColumnMenu: false,
                enableSorting: false,
                cellTemplate: 'btnTemplate.html'
            }

        ];

        groupService.getGroups().then(function (data) {
            $scope.gridOptions.data = data;
        });


        $scope.addGrp = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '/app/components/admin/modalAddGroup.html',
                controller: 'addGroupController'
            });

            modalInstance.result.then(function (group) {
                $scope.groupService.addGroup(group).then(function (data) {
                    $scope.gridOptions.data = data;
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                });
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
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

        $scope.showPhotos = function (groupNum) {
            $scope.groupService.getUploadedPhotos(groupNum).then(function (data) {
                var uploadedPhotos = {};
                for (var i = 0; i < data.length; i++) {
                    uploadedPhotos[data[i]] = groupService.downloadPhotoByNum(groupNum, data[i]);
                }

                $scope.modalOptions = {
                    groupNum: groupNum,
                    photos: uploadedPhotos
                };

                var modalInstance = $uibModal.open({
                    templateUrl: '/app/components/admin/modalShowPhotos.html',
                    controller: 'showPhotosController',
                    resolve: {
                        modalOptions: function () {
                            return $scope.modalOptions;
                        }
                    }
                });

            });
        };

        $scope.createInvoice = function (groupNum) {
            $scope.groupService.createInvoice(groupNum).then(function () {});
        };

        $scope.beginOrders = function (groupNum) {
            $scope.groupService.beginOrders(groupNum).then(function () {
                groupService.getGroups().then(function (data) {
                    $scope.gridOptions.data = 'data';
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    $timeout(function () {
                        $scope.gridOptions.data = data;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    }, 10);
                });
            });
        };

        $scope.closeOrders = function (groupNum) {
            $scope.groupService.closeOrders(groupNum).then(function () {
                groupService.getGroups().then(function (data) {
                    $scope.gridOptions.data = 'data';
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    $timeout(function () {
                        $scope.gridOptions.data = data;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    }, 10);
                });
            });
        };


        $scope.downloadInvoices = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            if (groups.length === 0) return;


            groupService.getAuthToken().then(function (auth) {
                var url = auth;
                url += "&g=" + groups[0].num;
                for (var i = 1; i < groups.length; i++) {
                    url += "&g=" + groups[i].num;
                }
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = config.api.url + "/classe/invoices" + url;
                a.click();
                a.parentNode.removeChild(a);
            });

        };

        $scope.copyEmail = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                text += groups[i].emailGroup + ", ";
            }
            window.prompt("Copier : Ctrl+C, Entrer", text);

        };

        $scope.copyEmailResp = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].emailResponsable !== undefined) {
                    text += groups[i].emailResponsable + ", ";
                }
            }
            window.prompt("Copier : Ctrl+C, Entrer", text);
        };

        $scope.dowload = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            if (groups.length === 0) return;
            groupService.getAuthToken().then(function (auth) {
                //console.log(auth)
                var url = auth;
                url += "&g=" + groups[0].num;
                for (var i = 1; i < groups.length; i++) {
                    url += "&g=" + groups[i].num;
                }
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = config.api.url + "/hdphotos" + url;
                a.click();
                a.parentNode.removeChild(a);
            });

        };
    }
]);

photosApp.controller('addGroupController', function ($scope, $uibModalInstance) {

    $scope.group = {
        num: "71",
        email: "pcg71@insa-lyon.fr",
        laniere: "Lanière A"
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.group);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

photosApp.controller('showPhotosController', function ($scope, $uibModalInstance, modalOptions) {
    $scope.modalOptions = modalOptions;

    $scope.photoName = {
        "0": "Photo 1",
        "1": "Photo 2",
        "2": "Photo 3",
        "3": "Photo 4",
        "4": "Photo 5",
        "5": "Photo 6"
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
