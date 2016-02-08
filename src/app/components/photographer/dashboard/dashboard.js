photosApp.controller('dashboardCtrl', ['$scope', 'groupService', '$filter', 'uiGridConstants', 'SweetAlert', 'i18nService', 'UserService', 'Notification', '$state', '$stateParams', '$uibModal',
    function($scope, groupService, $filter, uiGridConstants, SweetAlert, i18nService, UserService, Notification, $state, $stateParams, $uibModal) {
        $scope.groupService = groupService;
        i18nService.setCurrentLang('fr');

        $scope.myGroupState = false;


        $scope.changeState = function(myGroupState) {
            if ($scope.myGroupState === myGroupState) return;

            $scope.myGroupState = myGroupState;
            if (myGroupState === false) {

                $scope.gridApi.grid.columns[8].hideColumn();
                $scope.gridApi.grid.columns[7].showColumn();
                $scope.gridApi.grid.columns[6].hideColumn();
                $scope.gridApi.grid.columns[5].hideColumn();
                $scope.gridApi.grid.columns[4].hideColumn();
                groupService.getOtherGroups().then(function(data) {
                    $scope.gridOptions.data = data;
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                });
            }
            else {
                $scope.gridApi.grid.columns[8].showColumn();
                $scope.gridApi.grid.columns[7].hideColumn();
                $scope.gridApi.grid.columns[6].showColumn();
                $scope.gridApi.grid.columns[5].showColumn();
                $scope.gridApi.grid.columns[4].showColumn();
                Notification.success("Rappel : N'oublie pas de modifier l'état des groupes !");

                $scope.groupService.getMyGroups().then(function(data) {
                    $scope.gridOptions.data = data;
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                });
            }
        };


        $scope.gridOptions = {
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: false,
            showGridFooter: false,
            showColumnFooter: false,
            fastWatch: false,
            enableCellEdit: false,
            showFilter: false,
            rowHeight: 35,
            enableColumnMenu: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;

                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    if (newValue === oldValue) return;
                    if (colDef.name === 'status') {
                        if (oldValue === 'Commande en cours' || oldValue === 'Commande terminée' || oldValue === 'Argent récupéré' || oldValue === 'Achat des photos' || oldValue === 'Terminé') {
                            Notification.error("Vous ne pouvez plus modifier l'état une fois la commande lancée ou terminée");
                            rowEntity.status = oldValue;
                        }
                        else {
                            groupService.updateGroup(rowEntity.num, null, null, newValue);
                        }
                    }
                    else if (colDef.name === 'emailResponsable') {
                        groupService.updateGroup(rowEntity.num, newValue, null, null).then();
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

        $scope.gridOptions.rowIdentity = function(row) {
            return row.id;
        };
        $scope.gridOptions.getRowIdentity = function(row) {
            return row.id;
        };


        $scope.columns = [{
            name: 'laniere',
            displayName: "Lanière",
            enableColumnMenu: false,
        }, {
            name: 'num',
            displayName: "Groupe",
            enableColumnMenu: false,
            filter: {
                condition: uiGridConstants.filter.EXACT
            },
            sortingAlgorithm: util.naturalSort,
            sort: {
                direction: uiGridConstants.ASC
            }
        }, {
            name: 'emailGroup',
            displayName: 'Email du groupe',
            enableColumnMenu: false
        }, {
            name: 'emailResponsable',
            displayName: 'Email Responsable',
            enableColumnMenu: false,
            enableCellEdit: true,
            cellTemplate: 'editTemplate.html',
            visible: false
        }, {
            name: 'phoneNumber',
            displayName: 'Téléphone Responsable',
            enableColumnMenu: false,
            visible: false,
            cellTemplate: 'editTemplate.html',
            enableCellEdit: true
        }, {
            field: 'status',
            enableColumnMenu: false,
            cellTemplate: 'editTemplate.html',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
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
            visible: false,
            displayName: 'Etat',
            enableCellEdit: true,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'status',
            editDropdownOptionsArray: [{
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
            }]
        }, {
            name: 'Actions ',
            enableFiltering: false,
            enableColumnMenu: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-sm" ng-click=grid.appScope.chooseGroup(row.entity.num)>Choisir ce groupe</button ></div>'
        }, {
            name: 'Actions',
            enableFiltering: false,
            enableColumnMenu: false,
            enableSorting: false,
            visible: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><button ng-class="{disabled: grid.appScope.uploadDisabled(row) == true}" class="btn btn-primary btn-sm" ng-click="grid.appScope.uploadPhotos(row, row.entity.num)" >Uploader les photos</button ></div>'
        }];

        $scope.gridOptions.columnDefs = $scope.columns;


        $scope.uploadDisabled = function(row) {
            return (row.entity.ordersOpen === true || row.entity.status === 'Commande en cours' || row.entity.status === 'Commande terminée' || row.entity.status === 'Argent récupéré' || row.entity.status === 'Achat des photos' || row.entity.status === 'Terminé');
        };

        $scope.groupService.getMyGroups().then(function(groups) {
            if (groups.length === 0) {

                $uibModal.open({
                    templateUrl: 'welcomePhotographer.html'
                });

                $scope.groupService.getOtherGroups().then(function(data) {
                    $scope.gridOptions.data = data;
                });

            }
            else {
                $scope.changeState(true);
            }
            if ($stateParams.state === "mygroups") {
                $scope.changeState(true);
            }
        });


        $scope.copyEmail = function() {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                text += groups[i].emailGroup + ", ";
            }
            window.prompt("Copier : Ctrl+C, Entrer", text);
        };

        $scope.copyEmailResp = function() {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].emailResponsable !== undefined) {
                    text += groups[i].emailResponsable + ", ";
                }
            }
            window.prompt("Copier : Ctrl+C, Entrer", text);
        };

        $scope.user = UserService.currentUser.email;


        $scope.uploadPhotos = function(row, num) {
            if (row.entity.emailResponsable === "" || row.entity.emailResponsable === undefined) {
                Notification.error("Merci de donner l'email du responsable avant d'uploader les photos !");
                return;
            }
            
            if(row.entity.ordersOpen === true || row.entity.status === 'Commande en cours' || row.entity.status === 'Commande terminée' || row.entity.status === 'Argent récupéré' || row.entity.status === 'Achat des photos' || row.entity.status === 'Terminé'){
                Notification.error("Les commandes sont en cours ou terminées, il n'est pas possible d'envoyer de nouvelles photos. Contactez le bureau en cas de soucis.");

            }

            $state.go("photographe.upload", {
                num: num
            });

        };

        $scope.chooseGroup = function(num) {
            var modalInstance = $uibModal.open({
                templateUrl: 'mailDialog.html',
                keyboard: false,
                backdrop: 'static'
            });

            modalInstance.result.then(function() {
                groupService.chooseGroup(num).then(function() {
                    groupService.getOtherGroups().then(function(data) {
                        $scope.gridOptions.data = data;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        SweetAlert.swal("Super !", "Merci pour ton aide !", "success");
                    });
                });
            });
        };

    }
]);