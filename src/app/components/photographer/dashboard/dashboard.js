photosApp.controller('dashboardCtrl',  ['$scope', '$filter', 'groupService', 'UserService',
    function ($scope, filter, groupService, UserService) {

   $scope.groupService = groupService;
    $scope.user = UserService.currentUser.email;
    groupService.getMyGroups().then(function (data) {
        $scope.mygroups = data;
        $scope.displayedmygroups = [].concat($scope.mygroups);
    });

    groupService.getOtherGroups().then(function (data) {
        $scope.othergroups = data;
        $scope.displayedothergroups = [].concat($scope.othergroups);
    });

        $scope.chooseGroup = function(num){
           groupService.chooseGroup(num).then(function (){
               groupService.getOtherGroups().then(function (data) {
                   $scope.othergroups = data;
                   $scope.displayedothergroups = [].concat($scope.othergroups);
               });
               groupService.getMyGroups().then(function (data) {
                   $scope.mygroups = data;
                   $scope.displayedmygroups = [].concat($scope.mygroups);
               });
               }
           );
        }

}]);
