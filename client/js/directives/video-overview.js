'use strict';

angular.module('app.video-overview', []).directive('videoOverview', ['$state', 'Model',videoOverviewDirective]);

function videoOverviewDirective($state, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.getShot = function (chapter) {
        var d = new Date(chapter.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds()+2;
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      scope.getDuration = function (chapter) {
        return moment.utc(parseInt(chapter.duration)).format("m:ss");
      };

      scope.play = function (index) {
        $state.go('play', {user: Model.getUser(), videoId: scope.video.id, idx: index});
      };
    },
    templateUrl: 'partials/directives/video-overview.html'
  }
}
