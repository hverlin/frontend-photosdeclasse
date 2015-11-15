photosApp.controller('dashboardCtrl',  ['$scope', '$filter', 'groupService',
    function ($scope, filter, groupService) {

   $scope.groupService = groupService;

    groupService.getGroups().then(function (data) {
        $scope.mygroups = data;
        console.log(data)
        //$scope.displayedmygroups = [].concat($scope.mygroups);

    });

    groupService.getGroups().then(function (data) {
        $scope.othergroups = data;
        console.log(data)
        $scope.displayedothergroups = [].concat($scope.othergroups);
    });

        $scope.chooseGroup = function(num){
           groupService.chooseGroup(num).then(function (){
                   alert('ok');

               }
           );
        }

}]);
