photosApp.service('groupService', ['Restangular', '$log', '$q', manageGroup]);

function manageGroup(Restangular, $log, $q) {
  var self = this;

  self.addGroup = function (groupNumber) {
    return $q(function (resolve, reject) {
      Restangular.all('/classe').customPOST({number: groupNumber}).then(function () {
        self.getGroups().then(function(data) {
          $log.info('add group ' + groupNumber);
          resolve(data);
        });
      })
    }, function () {
      reject('Erreur de connexion !');
    })
  };

  self.getGroups = function () {
    console.log("ici");

    return $q(function (resolve, reject) {
      Restangular.one('/classe/all/').getList()
        .then(function (data) {
          resolve(data.plain());
        }, function () {
          reject('Erreur de connexion !');
        })
    })
  };

  self.getGroups = function () {
    return $q(function (resolve, reject) {
      Restangular.one('/classe/').get()
        .then(function (data) {
          resolve(data.plain().data);
        }, function () {
          reject('Erreur de connexion !');
        })
    })
  };

  self.getOrders = function () {
    return $q(function (resolve, reject) {
      Restangular.one('/classe/orders/').get()
        .then(function (data) {
          resolve(data.plain());
        }, function () {
          reject('Erreur de connexion !');
        })
    })
  };

}