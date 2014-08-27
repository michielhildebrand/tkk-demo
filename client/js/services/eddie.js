'use strict';

angular.module('Eddie', []).factory('eddie', ['$rootScope', eddieService]);

function eddieService($rootScope) {
  function generateSessionId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  var settings = _(ToolkitConfig).extend({sessionId: generateSessionId()});

  var eddie = Eddie({
    lou_ip: settings.ip,
    lou_port: settings.port,
    app: settings.app,
    fullapp: settings.fullapp,
    appparams: settings.appparams
  });

  return {
    init: function() {
      console.log('Initializing Eddie using session ' + settings.sessionId);
      eddie.init();

      $rootScope.$on("$destroy", function () {
        eddie.destroy();
      });
    },
    putLou: function (msg) {
      eddie.putLou('ngproxy', JSON.stringify(msg));
    },
    getSessionId: function () {
      return settings.sessionId;
    }
  }
}
