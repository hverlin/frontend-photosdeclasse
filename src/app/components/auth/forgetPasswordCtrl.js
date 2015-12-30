photosApp.controller('forgetPasswordCtrl', ['$scope', '$state', 'UserService', 'SweetAlert',
    function ($scope, $state, UserService, SweetAlert) {

        $scope.UserService = UserService;
        $scope.forgetPassword = function () {
            $scope.UserService.forgetPassword($scope.email)
                .then(function () {
                    SweetAlert.swal("C'est tout bon !", "Un mail avec les instructions pour changer de mot de passe t'a été envoyé ! Tu peux fermer la page !", "success");
                }, SweetAlert.swal("Erreur", "Cet email n'existe pas !", "error"));
        };
    }
]);