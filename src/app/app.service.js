var appServices = angular.module('photosApp.services', ['restangular']);

appServices
/**
 * Manage Session
 */
  .service('SessionService', ['$window', function ($window) {
    var self = this;

    self.setValue = function (key, value) {
      $window.localStorage['session.' + key] = value;
    };

    self.getValue = function (key) {
      return $window.localStorage['session.' + key];
    };

    self.destroyItem = function (key) {
      $window.localStorage.removeItem('session.' + key);
    };
  }])

/**
 * Manage JWT token
 */
  .service('AuthService', ['$window', 'SessionService', function ($window, SessionService) {
    var self = this;

    self.parseJwt = function (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };

    self.saveToken = function (token) {
      SessionService.setValue('Bearer', token);
    };

    self.getToken = function () {
      return SessionService.getValue('Bearer');
    };

    self.isAuthed = function () {
      var token = self.getToken();
      if (token) {
        var params = self.parseJwt(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
      } else {
        return false;
      }
    };

    self.logout = function () {
      return SessionService.destroyItem('Bearer');
    };
  }])

/**
 * Manage current user
 */
  .service("UserService", ['$q', '$state', '$log', 'SessionService', 'AuthService', 'Restangular',
    function ($q, $state, $log, SessionService, AuthService, Restangular) {
      var self = this;

      self.currentUser = {
        username: SessionService.getValue('email') || "",
        isLoggedIn: (SessionService.getValue('email') ? true : false)
      };

      self.login = function (email, password) {
        return $q(function(resolve, reject) {Restangular.one("/auth/signin")
          .customPOST({
            "email": email,
            "password": password
          })
          .then(function () {
            self.currentUser.email = email;
            self.currentUser.isLoggedIn = true;
            resolve('creation de l utilsateur réussie !');
          }, function () {
            reject('Erreur de connexion !');
          });
        });
      };

      self.changePassword = function (pass_id, password) {
        return $q(function(resolve, reject) {Restangular.one("/auth/changepassword")
            .customPUT({
              "pass_id": pass_id,
              "password": password
            })
            .then(function () {
              resolve('changement du mot de passe réussi !');
            }, function () {
              reject('Erreur de connexion !');
            });
        });
      };
      
      self.forgetPassword = function (email) {
        return $q(function(resolve, reject) {Restangular.one("/auth/forgetPassword/"+email)
            .get()
            .then(function () {
              resolve('Demande de changement de mot de passe envoyé !');
            }, function () {
              reject('Erreur de connexion !');
            });
        });
      };

        //self.register = function (username, email, password) {
      //  Restangular.one("/auth/signup")
      //    .customPOST({
      //      "username": username,
      //      "email": email,
      //      "password": password
      //    })
      //    .then(function (response) {
      //      $log.debug(response.plain());
      //      self.currentUser.email = email;
      //      self.currentUser.isLoggedIn = true;
      //      $log.info("register successfully!");
      //      $state.path("/home").replace();
      //
      //    }, function () {
      //      $log.error("login error");
      //    });
      //};

      //self.logout = function () {
      //  self.currentUser.username = null;
      //  self.currentUser.isLoggedIn = false;
      //  AuthService.logout();
      //  return $state.path("/login").replace();
      //};

      self.isAuthed = function () {
        return AuthService.isAuthed();
      };

      self.loginShowing = false;

      self.setLoginState = function (state) {
        self.loginShowing = state;
      };

    }]);