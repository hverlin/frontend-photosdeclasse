photosApp.service('groupService', ['Restangular', '$log', '$q', manageGroup]);

function manageGroup(Restangular, $log, $q) {
  var self = this;

  self.groups = [];

  self.addGroup = function (groupNumber) {
    return $q(function (resolve, reject) {
      Restangular.all('/classe').customPOST({number: groupNumber}).then(function () {
        $log.info('add group ' + groupNumber)
        self.getGroups().then(function() {
          resolve('Connexion réussie !');
        });
      })
    }, function () {
      reject('Erreur de connexion !');
    })
  };

  self.getGroups = function () {
    return $q(function (resolve, reject) {
      Restangular.one('/classe').get()
        .then(function (data) {
          self.groups = data.plain().data;
          resolve('Connexion réussie !');
        }, function () {
          reject('Erreur de connexion !');
        })
    })
  };

}