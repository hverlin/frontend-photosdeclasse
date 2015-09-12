photosApp.service('photographerService', ['Restangular', '$log', '$q', managePhotographers]);

function managePhotographers(Restangular, $log, $q) {
  var self = this;

  self.addPhotographer = function (email) {
    return $q(function (resolve, reject) {
      Restangular.all('/auth/addphtographer').customPOST({email: email}).then(function () {
        self.getGroups().then(function (data) {
          $log.info('add group ' + email);
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

}