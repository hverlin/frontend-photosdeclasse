photosApp.controller('selectionCtrl', ['$scope', '$filter', function (scope, filter) {
  scope.mygroups = [
    {num: '10', email: 'a@baca.insa-lyon.fr', phone: '06 54 83 41 02', photographer: "zozo", state: 'prise de photo'},
    {num: '11', email: 'a@baca.insa-lyon.fr', phone: '06 54 83 41 02', photographer: "zozo", state: 'photo envoyée'},
    {num: '12', email: 'a@baca.insa-lyon.fr', phone: '06 54 83 41 02', photographer: "zozo", state: 'prise de photo'}
  ];
}]);