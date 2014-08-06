'use strict';

angular.module('Data', ['ngResource']).factory('Data', data);

function data() {
  var data = {
    video: null,
    chapterIndex: null
  };

  return {
    setVideo: function (video) {
      data.video = video;
    },
    play: function(video, chapter) {
      data.chapterIndex = chapter;
      data.video = video;
    },
    getVideo: function () {
      return data.video;
    },
    getChapter: function () {
      return data.chapterIndex;
    },
    getTime: function() {
      return data.video.chapters[data.chapterIndex].startTime / 1000; //in seconds
    }
  };
}
