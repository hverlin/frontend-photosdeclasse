photosApp.controller('detailsClasses', ['$scope', 'groupService', '$filter', 'modalService', 'uiGridConstants', 'SweetAlert',
    function ($scope, groupService, $filter, modalService, uiGridConstants, SweetAlert) {
        $scope.groupService = groupService;

        $scope.gridOptions = {
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: false,
            showColumnFooter: false,
            fastWatch: false,
            enableCellEdit: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    var msg = 'row selected ' + row.isSelected;
                    console.log(msg);
                });
                gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                    if(colDef.name !== 'status') return;
                    if(newValue === oldValue) return;

                    groupService.updateGroup(rowEntity.num, null, null,newValue).then(function(){

                    });

                    $scope.$apply();
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

        var naturalSort = function (a, b) {
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
            {
                name: 'num', displayName: "Groupe", filter: {
                condition: uiGridConstants.filter.EXACT
            }, sortingAlgorithm: naturalSort,
                sort: {
                    direction: uiGridConstants.ASC
                }
            },
            {name: 'email', displayName: 'Email Responsable'},
            {name: 'phone', displayName: 'Téléphone Responsable'},
            {
                field: 'status',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        {value: 'Pas de photographe', label: 'Pas de photographe'},
                        {value: 'Classe contactée', label: 'Classe contactée'},
                        {value: 'Rendez-vous pris', label: 'Rendez-vous pris'},
                        {value: 'Photos prises', label: 'Photos prises'},
                        {value: 'Photos uploadées', label: 'Photos uploadées'},
                        {value: 'Commande terminée', label: 'Commande terminée'},
                        {value: 'Argent récupéré', label: 'Argent récupéré'},
                        {value: 'Achat des photos', label: 'Achat des photos'},
                        {value: 'Terminé', label: 'Terminé'}
                    ]
                }},
            {
                name: 'status',
                displayName: 'Etat',
                enableCellEdit: true,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownValueLabel: 'status',
                editDropdownOptionsArray: [
                    {id: 'Pas de photographe', status: 'Pas de photographe'},
                    {id: 'Classe contactée', status: 'Classe contactée'},
                    {id: 'Rendez-vous pris', status: 'Rendez-vous pris'},
                    {id: 'Photos prises', status: 'Photos prises'},
                    {id: 'Photos uploadées', status: 'Photos uploadées'},
                    {id: 'Commande terminée', status: 'Commande terminée'},
                    {id: 'Argent récupéré', status: 'Argent récupéré'},
                    {id: 'Achat des photos', status: 'Achat des photos'},
                    {id: 'Terminé', status: 'Terminé'}
                ]
            },
            {name: 'photographer.email', displayName: 'Photographe'},
            {
                name: 'Actions', enableFiltering: false, enableColumnMenu: false, enableSorting : false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href=\"\" ng-click=grid.appScope.showPhotos(row.entity.num)>Voir les photos</a></span></div>'
            }

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

        $scope.showPhotos = function (groupNum) {
            $scope.groupService.getUploadedPhotos(groupNum).then(function (data) {
                var uploadedPhotos = {};
                for (var i = 0; i < data.length; i++) {
                    uploadedPhotos[data[i]] = groupService.downloadPhotoByNum(groupNum, data[i]);
                }

                var modalOptions = {
                    headerText: 'Photos du groupe ' + groupNum,
                    photos: uploadedPhotos
                };

                modalService.showModal({}, modalOptions)
                    .then(function (result) {
                    });
            })
        };

        $scope.copyEmail = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                text += "pcg" + groups[i].num + "@listes.insa-lyon.fr, "
            }
            window.prompt("Copier : Ctrl+C, Entrer", text);

        };

        $scope.copyEmailResp = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            var text = "";
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].email !== undefined) {
                    text += groups[i].email + ", "
                }
            }

            window.prompt("Copier : Ctrl+C, Entrer", text);

        };

        $scope.dowload = function () {
            var groups = $scope.gridApi.selection.getSelectedRows();
            if (groups.length === 0) return;

            var url = "?g=" + groups[0].num;
            for (var i = 1; i < groups.length; i++) {
                url += "&g=" + groups[i].num;
            }
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = "https://backend-graines-hverlin.c9.io/v1/hdphotos" + url;
            a.click();
            a.parentNode.removeChild(a);
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
