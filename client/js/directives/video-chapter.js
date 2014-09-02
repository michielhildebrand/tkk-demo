'use strict';

angular.module('app.video-chapter', []).directive('videoChapter', ['$state', 'Eddie', 'Model', videoChapterDirective]);

function videoChapterDirective($state, Eddie, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '=',
      'index': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.isSelected = function() {
        return Model.getChapterIndex() == scope.index;
      };

      scope.getShot = function () {
        var d = new Date(scope.chapter.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      scope.getDuration = function () {
        return moment.utc(parseInt(scope.chapter.duration)).format("m:ss");
      };

      scope.play = function () {
        if ($state.current.name != 'play') {
          $state.go('play', {user: Model.getUser(), videoId: scope.video.id, idx: scope.index});
        } else {
          sendToPlayer({action: 'set-chapter', value: scope.index});
        }
      };

      function sendToPlayer(action) {
        Eddie.putLou({target: 'player', data: action});
      }
    },
    templateUrl: 'partials/directives/video-chapter.html'
  }
}