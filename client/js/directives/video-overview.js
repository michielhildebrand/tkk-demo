'use strict';

angular.module('app.video-overview', []).directive('videoOverview', ['$state', 'Eddie', 'Model',videoOverviewDirective]);

function videoOverviewDirective($state, Eddie, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.getShot = function (index) {
        var d = new Date(scope.video.chapters[index].startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };
      scope.play = function (index) {
        if ($state.current.name != 'play') {
          $state.go('play', {user: Model.getUser(), videoId: scope.video.id, idx: index});
        } else {
          sendToPlayer({action: 'set-chapter', value: scope.index});
        }
      };
    },
    templateUrl: 'partials/directives/video-overview.html'
  }
}
