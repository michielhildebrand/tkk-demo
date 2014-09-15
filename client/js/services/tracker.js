'use strict';

angular.module('Tracker', []).factory('Tracker', ['$interval', tracker]);

function tracker($interval) {
  var user, screenId, eventPublisher = null;
  var events = [];

  function initialize(u, sId) {
    user = u;
    screenId = sId;
    if (eventPublisher == null) eventPublisher = $interval(sendEvents, 5000);
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
      _(e).extend({user: user.id, screen: screenId});
      events.push(e);
    }
  };
}
