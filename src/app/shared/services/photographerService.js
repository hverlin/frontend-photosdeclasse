photosApp.service('photographerService', ['Restangular', '$log', '$q', managePhotographers]);

function managePhotographers(Restangular, $log, $q) {
  var self = this;

  self.addPhotographer = function (groupNumber) {
    return $q(function (resolve, reject) {
      Restangular.all('/auth/addphtographer').customPOST({num: groupNumber}).then(function () {
        self.getGroups().then(function (data) {
          $log.info('add group ' + groupNumber);
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