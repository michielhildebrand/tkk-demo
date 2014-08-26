'use strict';

angular.module('Eddie', []).factory('eddie', ['$rootScope', eddieService]);

/** Used to broadcast and listen for global events */
function eddieService($rootScope) {
  var sessionId = makeid();

  var louSettings = {
    lou_ip: window.location.hostname,
    lou_port: window.location.port,
    app: 'news',
    fullapp: '/domain/linkedtv/html5application/news',
    appparams: ""
  };

  var eddie = Eddie(louSettings);

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  return {
    init: function() {
      console.log('Initializing eddie using session ' + sessionId);
      eddie.init();

      $rootScope.$on("$destroy", function () {
        eddie.destroy();
      });
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    getSessionId: function () {
      return sessionId;
    }
  }
}
