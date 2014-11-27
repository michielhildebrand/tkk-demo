'use strict';

angular.module('Eddie', []).factory('Eddie', ['$log', 'Config', eddieService]);

function eddieService($log, Config) {
  var initialized = false;
  var userId;
  var screenId;
  var eddie;

  function initializeEddie(id) {
    debug('Initializing Eddie with userId: ' + id);
    userId = id;
    eddie = Eddie({
      lou_ip: Config.springfield_ip,
      lou_port: Config.springfield_port,
      app: Config.springfield_app,
      fullapp: Config.springfield_fullapp.replace('{}', id)
    });
    eddie.init();
    screenId = eddie.getScreenId().substring(eddie.getScreenId().lastIndexOf("/") + 1);
    initialized = true;
  }

  function destroyEddie() {
    eddie.destroy();
    initialized = false;
  }

  function debug(msg) {
    $log.debug('[Eddie (service)] ' + msg)
  }

  return {
    init: function(user) {
      if (!initialized) {
        initializeEddie(user.id);
      } else {
        debug('Eddie already initialized with userId ' + userId);
      }
      return screenId;
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    destroy: function() {
      destroyEddie();
    }
  }
}
