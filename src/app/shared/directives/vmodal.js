photosApp.factory('modal', function (vModal) {
    return vModal({
        controller: 'MyModalController',
        controllerAs: 'myModalCtrl',
        templateUrl: 'app/shared/directives/modal.html'
    });
})

    .controller('MyModalController', function ($scope, modal) {
        var ctrl = this;
        this.close = modal.deactivate;
    });

