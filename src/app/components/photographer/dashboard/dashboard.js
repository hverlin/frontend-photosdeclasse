photosApp.controller('dashboardCtrl',  ['$scope', '$filter', function (scope, filter) {
  scope.mygroups = [
    {num: '10', email: 'a@baca.insa-lyon.fr', phone : '06 54 83 41 02', state: 'prise de photo'},
    {num: '11', email: 'a@baca.insa-lyon.fr', phone : '06 54 83 41 02', state: 'photo envoyée'},
    {num: '12', email: 'a@baca.insa-lyon.fr', phone : '06 54 83 41 02', state: 'prise de photo'}
  ];

  scope.othergroups = [
    {num: '13', categorie: 'classique'},
    {num: '14', categorie: 'classique'},
    {num: '15', categorie: 'classique'},
    {num: '17', categorie: 'classique'}
  ];

}]);
