'use strict';

angular.module('Eddie', []).factory('Eddie', ['Config', 'Model', 'Tracker', eddieService]);

function eddieService(Config, Model, Tracker) {
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
  }

  function destroyEddie() {
    eddie.destroy();
    initialized = false;
  }

  return {
    init: function(user) {
      if (!initialized) {
        initializeEddie(user.id);
        Tracker.init(user, screenId);
        Model.signIn(user.name);
      } else {
        //console.log('Eddie already initialized with userId ' + userId);
      }
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    destroy: function(){
      Model.signOut();
      destroyEddie();
    }
  }
}
