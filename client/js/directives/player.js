'use strict';

angular.module('app.player', []).directive('player', playerDirective);

function playerDirective() {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {

      var updatePlayer = function(newVideo) {
        var player = element.children('video')[0];
        var source = element.children('source')[0];

        player.poster = newVideo.poster;
        source.src = newVideo.src;
        player.load();

        $(player).on('loadedmetadata', function () {
          player.currentTime = newVideo.currentTime;
        });
      };

      scope.$watch(attrs.video, function(video) {
        if (video) {
          updatePlayer(video);
        }
      });

    },
    templateUrl: 'partials/player.html'
  };
}

