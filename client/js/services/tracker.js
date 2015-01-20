'use strict';

angular.module('Tracker', []).factory('Tracker', ['$interval', '$log', '$http', 'Eddie', 'Config', tracker]);

function tracker($interval, $log, $http, Eddie, Config) {
  var user, screenId, eventPublisher, enabled = null;
  var events = [];

  var _gainAccountId = 'LINKEDTV-TEST';
  var _gainListenerUrl = Config.GAIN_API + '/listener';

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

  function videoGAINEvent(action, videoId, time) {
    sendGAINEvent({
      "type":"event",
      "objectId":videoId,
      "attributes":{
        "category":"Video",
        "action":action,
        "location":time
      }
    });
  }

  function chapterGAINEvent(action, videoId, chapter) {
    var entities = chapterEntities(chapter.dimensions);
    sendGAINEvent({
      "type":"event",
      "objectId":videoId,
      "attributes":{
        "action":action
      },
      "object":{
        "objectId":chapter.id,
        "entities":entities
      }
    });
  }

  function sendGAINEvent(e) {
    _(e).extend({
      "accountId": _gainAccountId,
      "userId": "/domain/linkedtv/user/"+user.id
    });
    debug('Send GAIN event: ' + JSON.stringify(e));
    $http.post(_gainListenerUrl, e);
  }

  function chapterEntities(dimensions) {
    var entityDimension = _(dimensions).find(function(d) {
      return d.type == 'entity';
    });
    var entities = [];
    console.log(entityDimension.items);
    _(entityDimension.items).forEach(function(e) {
      if(e.uri) {
        entities.push({
          "lod":e.uri,
          "label":e.title
        })
      }
    });
    return entities;
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
    },

    /* GAIN Events */
    video: function(action, videoId, time) {
      videoGAINEvent(action, videoId, time);
    },
    bookmark: function(videoId, chapterId) {
      chapterGAINEvent('bookmark', videoId, chapterId);
    }
    
  };
}
