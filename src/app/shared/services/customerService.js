photosApp.service('customerService', ['Restangular', '$log', '$q', manageCustomer]);

function manageCustomer(Restangular, $log, $q) {
    var self = this;

    self.customer = {};

    self.createCustomer = function (email, grpNumber) {
        return $q(function (resolve, reject) {
            Restangular.one('/customer/').customPOST({
                email: email,
                group: grpNumber
            }).then(function () {
                $log.info('add group ' + email);
                resolve('creation de l utilsateur réussie !');
            });
        }, function () {
            reject('Erreur de connexion !');
        });
    };


    self.getCustomerFromAuthToken = function (authToken) {
        return $q(function (resolve, reject) {
            Restangular.one('/customer?auth_token=' + authToken).customGET().then(function (data) {
                resolve(data.plain());
            });
        }, function () {
            reject('Erreur de connexion !');
        });
    };

    self.getUploadedPhotos = function (authToken) {
        return $q(function (resolve, reject) {
            Restangular.one('/customer/photos?auth_token=' + authToken).get()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion uploadedphotos');
                });
        });
    };


    self.getGroupList = function (authToken) {
        return $q(function (resolve, reject) {
            Restangular.one('/customer/group?auth_token=' + authToken).get()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion groupList');
                });
        });
    };


    self.downloadPhotoByNum = function (authToken, photoNum) {
        return config.api.url + '/customer/photo?number=' + photoNum + '&auth_token=' + authToken;
    };

    self.createOrder = function (authToken, order) {
        return $q(function (resolve, reject) {
            Restangular.one('/order?auth_token=' + authToken).customPOST({
                    order: order
                })
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion uploadedphotos');
                });
        });
    };

}