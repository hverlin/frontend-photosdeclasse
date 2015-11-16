photosApp.service('photographerService', ['Restangular', '$log', '$q', managePhotographers]);

function managePhotographers(Restangular, $log, $q) {
    var self = this;

    self.addPhotographer = function (email) {
        return $q(function (resolve, reject) {
            Restangular.all('/auth/addphotographer').customPOST({email: email})
                .then(function () {
                    self.getPhotographers().then(function (data) {
                        $log.info('add photographer ' + email);
                        resolve(data);
                    });
                })
        }, function () {
            reject('Erreur de connexion !');
        })
    };

    self.getPhotographers = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/photographers').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                })
        })
    };

    self.removePhotographer = function (email) {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/')
                .remove({email:email})
                .then(function () {
                    self.getPhotographers().then(function (data) {
                        $log.info('remove photographer ' + email);
                        resolve(data);
                    });
                }, function () {
                    reject('Erreur de connexion !');
                })
        })
    };

}