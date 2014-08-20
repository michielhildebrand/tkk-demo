'use strict';

angular.module('Model', ['ngResource']).factory('Model', model);

function model() {
  var data = {
    video: null,
    chapterIndex: null,
    bookmarks: []
  };

  return {
    setVideo: function (video) {
      data.video = video;
    },
    play: function (video, chapter) {
      data.chapterIndex = parseInt(chapter);
      data.video = video;
    },
    getVideo: function () {
      return data.video;
    },
    videoDuration: function () {
      return data.video.duration;
    },
    getChapterIndex: function () {
      return data.chapterIndex;
    },
    chapterStartTime: function () {
      return data.video.chapters[data.chapterIndex].startTime;
    },
    isFirstChapter: function () {
      return data.chapterIndex == 0;
    },
    isLastChapter: function () {
      return data.chapterIndex == (data.video.chapters.length - 1);
    },
    getTime: function () {
      return data.video.chapters[data.chapterIndex].startTime / 1000; //in seconds
    },
    getBookmarks: function () {
      return data.bookmarks;
    },
    bookmark: function (chapterId) {
      data.bookmarks = _.union(data.bookmarks, [chapterId]);
      return data.bookmarks;
    },
    unbookmark: function (chapterId) {
      data.bookmarks = _.difference(data.bookmarks, [chapterId]);
      return data.bookmarks;
    }
  };
}
