'use strict';

angular.module('Model', ['ngResource']).factory('Model', model);

function model() {
  var data = {
    user: null,
    videos: [],
    currentVideo: null,
    currentChapterIndex: null,
    currentChapter: null,
    bookmarks: []
  };

  function setVideo(id) {
    data.currentVideo = _(data.videos).find(function(v) {
      return v.id == id;
    });
  }

  function setChapter(index) {
    data.currentChapterIndex = parseInt(index);
    data.currentChapter = data.currentVideo.chapters[index];
  }

  return {
    underlyingData: data,
    setUser: function(user) {
      data.user = user;
    },
    getUser: function() {
      return data.user;
    },
    setVideos: function(videos){
      data.videos = videos;
    },
    getVideos: function () {
      return data.videos;
    },
    play: function (videoId, chapterIndex) {
      setVideo(videoId);
      setChapter(chapterIndex)
    },
    seek: function(chapterIndex) {
      setChapter(chapterIndex);
    },
    getVideo: function() {
      return data.currentVideo;
    },
    getChapter: function() {
      return data.currentChapter;
    },
    getChapterIndex: function () {
      return data.currentChapterIndex;
    },
    isFirstChapter: function () {
      return data.currentChapterIndex == 0;
    },
    isLastChapter: function () {
      return data.currentChapterIndex == (data.currentVideo.chapters.length - 1);
    },
    getTime: function () {
      return data.currentChapter.startTime / 1000; //in seconds
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
