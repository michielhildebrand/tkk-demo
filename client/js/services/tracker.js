'use strict';

angular.module('Tracker', []).factory('Tracker', ['$interval', tracker]);

function tracker($interval) {
  var user, screenId, eventPublisher, enabled = null;
  var events = [];

  function initialize(u, sId) {
    user = u;
    screenId = sId;
    if (eventPublisher == null) eventPublisher = $interval(sendEvents, 5000);
    enabled = true;
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
      console.log('Send events', eventsToSend);
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
