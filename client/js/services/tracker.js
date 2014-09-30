'use strict';

angular.module('Tracker', []).factory('Tracker', ['$interval', 'Eddie', 'Config', tracker]);

function tracker($interval, Eddie, Config) {
  var user, screenId, eventPublisher, enabled = null;
  var events = [];

  function initialize(u, sId) {
    user = u;
    screenId = sId;
    if (eventPublisher == null) eventPublisher = $interval(sendEvents, 5000);
    enabled = Config.tracking_enabled_default;
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
      //console.log('Send events', eventsToSend);
      Eddie.putLou({target: 'tracker', data: eventsToSend});
    }
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
