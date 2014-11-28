'use strict';

angular.module('Eddie', []).factory('Eddie', ['$log', '$window', '$timeout', 'Config', 'eventsBus', eddieService]);

function eddieService($log, $window, $timeout, Config, eventsBus) {
  var initialized = false, userId, screenId, eddie;
  var replacementRetry = 0;

  function initializeEddie(id) {
    debug('Initializing - user: ' + id + ', springfield: ' + Config.springfield_ip);
    userId = id;
    eddie = Eddie({
      lou_ip: Config.springfield_ip,
      lou_port: Config.springfield_port,
      app: Config.springfield_app,
      fullapp: Config.springfield_fullapp.replace('{}', id)
    });
    $window.eddie = eddie;
    eddie.init();
    screenId = eddie.getScreenId().substring(eddie.getScreenId().lastIndexOf("/") + 1);
    initialized = true;

    $timeout(replaceToolkitComponents, 1000);
  }

  function replaceToolkitComponents() {
    var comps = $window.components;
    if (comps && comps['notification']) {
      debug('Notification component now present, replacing it ...');
      comps['notification'] = new MyNotification();
    } else {
      debug('Notification component not present yet, keep checking ...');
      ++replacementRetry;
      if (replacementRetry < 5) {
        $timeout(replaceToolkitComponents, 1000);
      } else {
        debug('Stops checking for the replacement.')
      }
    }
  }

  var MyNotification = function() {
    self.putMsg = function(msg) {
      //console.log('Notification Message', msg);
      var target = msg.target[0].id;
      if (target == 'vidtimesignal') {
        var time = msg.content.split(':')[0] * 1000; //in milliseconds
        eventsBus.publish('player-time', time);
      }
    };
    return self;
  };

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
