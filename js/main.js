'use strict';

var app = angular.module('itTaskApp', []);

angular.element(document).ready(function() { 
    angular.bootstrap(document, ['itTaskApp']);
  });

app.controller('MultiSelecttController', ['dataService', function (dataService) {
  var select = this;

  select.$objects = [];
  select.load = function(id) {
    var promise = dataService.getData(id);

    promise.then(function (value) {
      select.$objects = value;
    });
  
    return promise;
  };
}]);


// multiselct derective for itTask
app.factory('dataService', ['$http', '$q', function ($http, $q) {
  return {
    getData: function (dataUrl) {
      var deferred = $q.defer();
      $http({ metod: 'GET', url: dataUrl}).success(function (data) {
          return deferred.resolve(data);
        })
        .error(function (status) {
          deferred.reject(status);
        });
      return deferred.promise;
    }
  };
}]);

app.directive('multiselct', [function () {
  return {
    // replace: true,
    restrict: 'EA',
    controller: 'MultiSelecttController',
    controllerAs: 'select',
    require: 'ngModel',
    template: '<select multiple ng-model="items" ng-options="item.code as item.display for item in select.$objects"></select>',
    scope: {},
    link: function (scope, element, attrs, ngModel) {

      scope.select.load(attrs.system);
      
      angular.element('select', element).on('change', function() { 
        var result = _.map(scope.items, function(code) {
          var temp =  _.findWhere(scope.select.$objects, { code: code });
          temp.system = 'urn:' + code + ':' + attrs.system;
          return temp;
        });

        ngModel.$setViewValue(result);
      }) 
      ngModel.$render = function() {
        scope.items = _.pluck(ngModel.$viewValue, 'code')
        console.log(scope.items);
      };
    }
  };
}]);

app.controller('TestController', ['$scope', '$timeout',  function ($scope, $timeout) {
  $scope.item = [];

  $timeout(function() {
    $scope.item = [
          {
            "system": "urn:oid:1.2.643.2.40.2.3.11",
            "display": "Стабильное поддержание целевых показателей гликемии и HbA1c",
            "code": 3
          },
          {
            "system": "urn:oid:1.2.643.2.40.2.3.11",
            "display": "Нормализация массы тела",
            "code": 4
          }
        ];
    }, 3000); 
}]);