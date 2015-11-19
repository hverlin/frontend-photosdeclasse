photosApp.service('groupService', ['Restangular', '$log', '$q', 'AuthService', manageGroup]);

function manageGroup(Restangular, $log, $q, AuthService) {
    var self = this;

    self.addGroup = function (groupNumber) {
        return $q(function (resolve, reject) {
            Restangular.all('/classe').customPOST({num: groupNumber}).then(function () {
                self.getGroups().then(function (data) {
                    $log.info('add group ' + groupNumber);
                    resolve(data);
                });
            })
        }, function () {
            reject('Erreur de connexion !');
        })
    };

    self.getGroups = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/all/').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                })
        })
    };

    self.getMyGroups = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/groups/').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                })
        })
    };

    self.getOtherGroups = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/othergroups/').getList()
                .then(function (data) {
                    resolve(data.plain());
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

    self.deleteGroups = function (num) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/' + num + '/').remove()
                .then(function () {
                    resolve('deleted');
                }, function () {
                    reject('Erreur while deleted group !');
                })
        })
    };

    self.chooseGroup = function (group) {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/addGroup/').customPOST({
                "groupNum": group
            }).then(function (){
                resolve();
            }, function () {
                reject('error in choose group');
            })
        })
    };

    self.downloadPhoto = function (group) {
        return $q(function (resolve, reject) {
            var urls = [];
            for(var i = 0; i < 6; i++){
                urls.push(config.api.url+'/photo?grpnumber='+group+'&number='+i+'&auth='+AuthService.getToken())
            }
            resolve(urls);
        })
    };



}