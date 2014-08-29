'use strict';

angular.module('Eddie', []).factory('Eddie', ['$rootScope', 'Config', 'Model', eddieService]);

function eddieService($rootScope, Config, Model) {
  var initialized = false;
  var user;
  var eddie;

  function initializeEddie(u) {
    console.log('Initializing Eddie with user ' + u);
    user = u;
    eddie = Eddie({
      lou_ip: Config.springfield_ip,
      lou_port: Config.springfield_port,
      app: Config.springfield_app,
      fullapp: Config.springfield_fullapp.replace('{}', u),
      appparams: Config.springfield_appparams
    });
    eddie.init();
    initialized = true;

    $rootScope.$on("$destroy", function () {
      eddie.destroy();
    });
  }

  return {
    init: function(user) {
      if (!initialized) {
        Model.setUser(user);
        initializeEddie(user);
      } else {
        //console.log('Eddie already initialized with user ' + user);
      }
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    getUser: function () {
      return user;
    }
  }
}
