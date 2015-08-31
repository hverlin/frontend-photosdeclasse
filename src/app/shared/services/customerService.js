photosApp.service('customerService', ['Restangular', '$log', '$q', manageCustomer]);

function manageCustomer(Restangular, $log, $q) {
  var self = this;

  self.customer = {};

  self.createCustomer = function (email, grpNumber) {
    return $q(function (resolve, reject) {
      Restangular.one('/customer/').customPOST({email: email, number: grpNumber}).then(function () {
        $log.info('add group ' + email)
        self.getGroups().then(function() {
          resolve('creation de l utilsateur réussie !');
        });
      })
    }, function () {
      reject('Erreur de connexion !');
    })
  };

}