'use strict';

angular.module('app.entity-slider', []).directive('entitySlider', ['$log', 'entityProxy', 'Model', entitySliderDirective]);

function entitySliderDirective($log, entityProxy, Model) {
    return {
        restrict: 'E',
        scope: {
        },
        replace: false,
        link: function (scope, element, attrs) {

            scope.$watch(
                function () {
                    return Model.getChapter()
                },
                function (newChapter) {
                    if (newChapter != null && newChapter.fragments != null) {
                        setEntityContent(newChapter.fragments);
                    }
                }
            );

            function setEntityContent(entities) {
                var urls =  _.chain(entities)
                    .filter(function(e) { return e.locator; })
                    .sortBy(function(e) { return e.startTime; })
                    .map(function(e) { return e.locator; })
                    .value();

                console.log(urls);

                entityProxy.getList({urls:angular.toJson(urls)}, function (r) {
                    console.log(r);
                    scope.entities = r;
                });
            }
        },

        templateUrl: 'partials/directives/entity-slider.html'
    }
}
