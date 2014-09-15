'use strict';

angular.module('Eddie', []).factory('Eddie', ['$rootScope', 'Config', 'Model', 'Tracker', eddieService]);

function eddieService($rootScope, Config, Model, Tracker) {
  var initialized = false;
  var userId;
  var screenId;
  var eddie;

  function initializeEddie(id) {
    console.log('Initializing Eddie with userId ' + id);
    userId = id;
    eddie = Eddie({
      lou_ip: Config.springfield_ip,
      lou_port: Config.springfield_port,
      app: Config.springfield_app,
      fullapp: Config.springfield_fullapp.replace('{}', id),
      appparams: Config.springfield_appparams
    });
    eddie.init();
    screenId = eddie.getScreenId().substring(eddie.getScreenId().lastIndexOf("/") + 1);
    initialized = true;

    $rootScope.$on("$destroy", function () {
      eddie.destroy();
    });
  }

  function destroyEddie() {
    eddie.destroy();
    initialized = false;
  }

  return {
    init: function(user) {
      if (!initialized) {
        initializeEddie(user.id);
        Model.setUser(user.name, screenId);
        Tracker.collect({action: 'user_login'});
      } else {
        //console.log('Eddie already initialized with userId ' + userId);
      }
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    destroy: function(){
      Tracker.collect({action: 'user_logout'});
      Model.resetUser();
      destroyEddie();
    }
  }
}
