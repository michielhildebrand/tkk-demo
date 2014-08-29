'use strict';

angular.module('Eddie', []).factory('Eddie', ['$rootScope', 'Config', eddieService]);

function eddieService($rootScope, Config) {
  var user;
  var eddie;

  function initializeEddie(u) {
    user = u;

    console.log('Initializing Eddie with user ' + u);
    eddie = Eddie({
      lou_ip: Config.springfield_ip,
      lou_port: Config.springfield_port,
      app: Config.springfield_app,
      fullapp: Config.springfield_fullapp.replace('{}', u),
      appparams: Config.springfield_appparams
    });
    eddie.init();

    $rootScope.$on("$destroy", function () {
      eddie.destroy();
    });
  }

  return {
    init: function(user) {
      initializeEddie(user);
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    getUser: function () {
      return user;
    }
  }
}
