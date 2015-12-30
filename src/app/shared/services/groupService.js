photosApp.service('groupService', ['Restangular', '$log', '$q', 'AuthService', 'Notification', manageGroup]);

function manageGroup(Restangular, $log, $q, AuthService, Notification) {
    var self = this;

    self.addGroup = function (group) {
        return $q(function (resolve, reject) {
            Restangular.all('/classe').customPOST({
                num: group.num,
                laniere: group.laniere,
                emailGroup: group.email
            }).then(function () {
                self.getGroups().then(function (data) {
                    resolve(data);
                }, function () {
                    reject('Erreur de connexion !');
                });
            });
        });
    };

    self.getGroups = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/all/').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };


    self.getOrderForGroup = function (num) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/' + num + '/students').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };


    self.getMyGroups = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/groups/').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };

    self.getOtherGroups = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/othergroups/').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };


    self.getOrders = function () {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/orders/').get()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };


    self.createInvoice = function (num) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/' + num + '/invoice').get()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };

    self.deleteGroups = function (num) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/' + num + '/').remove()
                .then(function () {
                    resolve('deleted');
                }, function () {
                    reject('Erreur while deleted group !');
                });
        });
    };

    self.deleteCustomer = function (email) {
        return $q(function (resolve, reject) {
            Restangular.one('/customer/' + email).remove()
                .then(function () {
                    resolve('deleted');
                }, function () {
                    reject('Erreur while deleted customer !');
                });
        });
    };

    self.updateOrder = function (order) {
        return $q(function (resolve, reject) {
            Restangular.one('/updateorder?order=' + order.id + '+&p1=' + order.photo_1 + '&p2=' + order.photo_2 + '&p3=' + order.photo_3 + '&p4=' + order.photo_4 + '&p5=' + order.photo_5 + '&p6=' + order.photo_6).customPUT({})
                .then(function () {
                    Notification.primary("Commande mise à jour ! <br> (rafraichir la page pour mettre à jour la date et le total)");
                    resolve();
                }, function () {
                    reject('error during update commande');
                });
        });
    };

    self.addOrder = function (order) {
        return $q(function (resolve, reject) {
            Restangular.one('/createorderwithemail').customPOST({
                    email: order.email,
                    group: order.group,
                    photo_1: order.p1,
                    photo_2: order.p2,
                    photo_3: order.p3,
                    photo_4: order.p4,
                    photo_5: order.p5,
                    photo_6: order.p6
                })
                .then(function () {
                    Notification.primary("Commande créée");
                    resolve("Commande créée");
                }, function () {
                    reject('error during update commande');
                });
        });
    };


    self.chooseGroup = function (group) {
        return $q(function (resolve, reject) {
            Restangular.one('/photographer/addGroup/').customPOST({
                "groupNum": group
            }).then(function () {
                resolve();
            }, function () {
                reject('error in choose group');
            });
        });
    };

    self.updateGroup = function (group, email, phone, state) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/' + group + '?emailResponsable=' + email + '&phoneNumber=' + phone + '&state=' + state).customPUT({})
                .then(function () {
                    Notification.primary("Groupe " + group + " mis à jour !");
                    resolve();
                }, function () {
                    reject('error in choose group');
                });
        });
    };

    self.beginOrders = function (group) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/beginorders/' + group).customPUT({})
                .then(function () {
                    Notification.primary("Commandes du groupe " + group + " ouvertes !");
                    resolve();
                }, function () {
                    reject('error in choose group');
                });
        });
    };

    self.closeOrders = function (group) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/closeorders/' + group).customPUT({})
                .then(function () {
                    Notification.primary("Commandes du groupe " + group + " fermées !");
                    resolve();
                }, function () {
                    reject('error in choose group');
                });
        });
    };
    
    self.getAllClassesForOrders = function (group) {
        return $q(function (resolve, reject) {
            Restangular.one('/classe/ordersopen').getList()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion !');
                });
        });
    };

    self.downloadPhoto = function (group) {
        return $q(function (resolve, reject) {
            var urls = [];
            for (var i = 0; i < 6; i++) {
                urls.push(config.api.url + '/photo?grpnumber=' + group + '&number=' + i + '&auth=' + AuthService.getToken())
            }
            resolve(urls);
        });
    };
    
    self.getAuthToken = function () {
        return $q(function (resolve, reject) {
            var url = '?auth=' + AuthService.getToken();
            resolve(url);
        });
    };
    

    self.deletePhoto = function (photo, group) {
        return $q(function (resolve, reject) {
            Restangular.one('/photo?group=' + group + '&photo=' + photo).remove()
                .then(function () {
                    resolve('deleted');
                }, function () {
                    reject('Erreur while deleted customer !');
                });
        });
    };

    self.downloadPhotoByNum = function (groupNum, photoNum) {
        return config.api.url + '/photo?grpnumber=' + groupNum + '&number=' + photoNum + '&auth=' + AuthService.getToken();
    };


    self.getUploadedPhotos = function (group) {
        return $q(function (resolve, reject) {
            Restangular.one('/uploadedphotos/' + group).get()
                .then(function (data) {
                    resolve(data.plain());
                }, function () {
                    reject('Erreur de connexion uploadedphotos');
                });
        });
    };

    self.getHDPhotos = function (group) {
        return $q(function (resolve, reject) {
            var filters = {
                "title": 'some value',
                "type[]": ['Full Time', 'Part Time']
            };
            Restangular.one('/uploadedphotos/' + group).withHttpConfig({
                    responseType: 'blob'
                }).get(filters)
                .then(function (data) {
                    var url = window.URL.createObjectURL(data);
                    resolve(url);
                }, function () {
                    reject('Erreur de connexion uploadedphotos');
                })
        })
    };

}