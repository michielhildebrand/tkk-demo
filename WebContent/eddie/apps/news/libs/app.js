'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',
  'tkkControllers',
  'tkkServices'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/eddie/apps/news/libs/ng/partials/mediaresource.html',
        controller: 'MediaResourceCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]).constant('CONFIG', {
  API_ROOT: 'http://data.linkedtv.eu'
});