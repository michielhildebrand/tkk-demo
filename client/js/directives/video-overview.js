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
      var chapterWidth = 178;
      var scrollViewWidth = element.parent().width();
      var scrollWidth = scope.video.chapters.length * 178;
      $(element.children()[0]).width(scrollViewWidth);
      $(element.children()[0].children[0]).width(scrollWidth);
   
      scope.play = function (index) {
        $state.go('play', {user: Model.getUser(), videoId: scope.video.id, idx: index});
      };
    },
    templateUrl: 'partials/directives/video-overview.html'
  }
}
