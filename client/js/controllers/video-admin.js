'use strict';

angular.module('VideoAdminCtrl', []).controller('VideoAdminCtrl', ['$scope', '$stateParams', 'linkedtvSparql', '$log' ,videoAdminCtrl]);

function videoAdminCtrl($scope, $stateParams, linkedtvSparql, $log) {
    $scope.videoId = $stateParams.videoId;

    function chapterMap(chapters) {
        return _.map(chapters, function (e) {
            var url = e.chapter.value;
            var id = url.substr(url.lastIndexOf('/') + 1);
            var startTime = e.start.value*1000,
                endTime = e.end.value*1000;

            return {
                "id": id,
                "startTime": startTime,
                "endTime": endTime,
                "duration": endTime - startTime,
                "title": e.label.value
            };
        });
    }

    function chapterEntityInclude(chapters, entities) {
        return _.map(chapters, function (chapter) {
            chapter.fragments = [];

            _.each(entities, function (e) {
                var startTime = e.start.value*1000,
                    endTime = e.end.value*1000;

                if (startTime > chapter.endTime) {
                    return chapter;
                }
                else if (startTime > chapter.startTime && endTime <= chapter.endTime) {
                    chapter.fragments.push({
                        "uri": e.entity.value,
                        "startTime": startTime,
                        "endTime": endTime,
                        "duration": endTime - startTime
                    })
                }
            });
            return chapter;
        });
    }

    linkedtvSparql.getChapters({mediaresource: $scope.videoId}, function (res) {
        var chapters = chapterMap(res.results.bindings);

        linkedtvSparql.getEntities({mediaresource: $scope.videoId}, function (res) {
            chapters = chapterEntityInclude(chapters, res.results.bindings);

            linkedtvSparql.getEnrichments({mediaresource: $scope.videoId}, function (res) {

                $scope.chapters = angular.toJson(chapters, true);
            });



        });
    });

    function debug(msg) {
        $log.debug('[Video Admin (ctrl)] ' + msg)
    }
}
