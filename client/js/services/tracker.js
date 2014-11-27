'use strict';

angular.module('Tracker', []).factory('Tracker', ['$interval', '$log', 'Eddie', 'Config', tracker]);

function tracker($interval, $log, Eddie, Config) {
  var user, screenId, eventPublisher, enabled = null;
  var events = [];

  function initialize(u, sId) {
    user = u;
    screenId = sId;
    if (eventPublisher == null) eventPublisher = $interval(sendEvents, 5000);
    enabled = Config.tracking_enabled_default;
    debug('Initializing with: enabled=' + enabled);
  }

  function pushEvent(e) {
    if (enabled) {
      _(e).extend({user: user.id, screen: screenId});
      events.push(e);
    }
  }

  function sendEvents() {
    var eventsToSend = events;
    events = [];
    if (eventsToSend.length > 0) {
      debug('Send events: ' + JSON.stringify(eventsToSend));
      Eddie.putLou({target: 'tracker', data: eventsToSend});
    }
  }

  function debug(msg) {
    $log.debug('[Tracker (service)] ' + msg)
  }

  return {
    init: function (u, sId) {
      initialize(u, sId);
    },
    collect: function (e) {
      pushEvent(e);
    },
    toggle: function() {
      enabled = !enabled;
      return enabled;
    },
    enabled: function() {
      return enabled == true;
    }
  };
}
