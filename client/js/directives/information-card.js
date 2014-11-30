'use strict';

var informationCard = angular.module('app.information-card', []);

informationCard.directive('informationCard', ['$sce', '$state', 'Model', '$log', informationCardDirective]);

function informationCardDirective($sce, $state, Model, $log) {
  return {
    restrict: 'E',
    scope: {
      'content': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.$watch('content', function (newContent) {
        scope.external = null;
        if (newContent != null) {
          scope.type = newContent.type;
          scope.item = newContent.item;
        } else {
          scope.type = null;
          scope.item = null;
        }
      });

      scope.toggleExternalUrl = function (url) {
        console.log('show: ', url);
        if (url) {
          scope.external = $sce.trustAsResourceUrl(url);
        } else {
          scope.external = null;
        }
      };

      /* these video specific things should not be here */
      scope.getShot = function () {
        if (scope.item.chapter.image) {
          return scope.item.chapter.image;
        }
        else if (scope.item.video && scope.item.video.shots) {
          var d = new Date(scope.item.chapter.startTime);
          d.setSeconds(d.getSeconds() + 2); // +2 because the shots are a bit of
          var h = d.getHours() - 1;
          var m = d.getMinutes();
          var s = d.getSeconds();
          return scope.item.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
        } else {
          return "";
        }
      };

      scope.playUrl = function (videoId, chapterId) {
        return $state.href('play', {user: Model.getUser(), videoId: videoId, chId: chapterId, mode: 'watch'});
      };

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}

informationCard.filter('rawAttribute', function () {
  var templateProps = ['birthDate', 'birthPlace', 'deathDate', 'deathPlace'];

  return function (items) {
    var filtered = {};
    _(items).forEach(function (value, key) {
      if (!_.contains(templateProps, key)) {
        filtered[key] = value;
      }
    });
    return filtered;
  };
});