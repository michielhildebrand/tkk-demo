'use strict';

angular.module('Tracker', []).factory('Tracker', ['$interval', 'Model', tracker]);

function tracker($interval, Model) {
  var events = [];

  $interval(sendEvents, 5000);

  function sendEvents() {
    var eventsToSend = events;
    events = [];
    if (eventsToSend.length > 0) {
      console.log('Send events', eventsToSend);
    }
  }

  return {
    addEvent: function(e) {
      _(e).extend({user: Model.getUser(), screen: Model.getScreenId()});
      events.push(e);
    }
  };
}
