'use strict';

angular.module('Model', []).factory('Model', ['$log', 'Tracker', model]);

function model($log, Tracker) {
  var data = {
    user: null,
    videos: [],
    currentVideo: null,
    currentChapter: null,
    currentChapterIndex: null,
    currentFragment: null,
    currentTime: null,
    beaming: false,
    bookmarks: [],
    history: []
  };

  function setVideo(id) {
    data.currentVideo = _(data.videos).find(function (v) {
      return v.id == id;
    });
  }

  function setChapter(index, startTime) {
    data.currentChapterIndex = parseInt(index);
    var chapter = data.currentVideo.chapters[data.currentChapterIndex];
    if (startTime == null) {
      data.currentTime = chapter.startTime;
    } else {
      data.currentTime = startTime;
    }
    debug('Current chapter: ' + chapter.title);
    data.currentChapter = chapter;
    findAndSetFragment(data.currentTime);
  }

  function findAndSetFragment(startTime) {
    var fragment = _.chain(data.currentChapter.fragments).min(function (f) {
      return f.startTime - startTime;
    }).value();
    debug('Current fragment: ' + fragment.title);
    data.currentFragment = fragment;
  }

  function findChapter(time) {
    var ch = _.chain(data.currentVideo.chapters).map(function (ch, index) {
      return {ch: ch, idx: index};
    }).filter(function (o) {
      return o.ch.startTime <= time;
    }).min(function (o) {
      return time - o.ch.startTime;
    }).value();
    setChapter(ch.idx);
  }

  function addCurrentToHistory() {
    if (data.currentVideo != null && data.currentChapter != null) {
      data.history.push({video: data.currentVideo, chapter: data.currentChapter, index: data.currentChapterIndex});
    }
  }

  function debug(msg) {
    $log.debug('[Model] ' + msg)
  }

  return {
    signIn: function (user) {
      data.user = user;
      Tracker.collect({action: 'user_login'});
    },
    getUser: function () {
      return data.user;
    },
    setVideos: function (videos) {
      data.videos = videos;
    },
    getVideos: function () {
      return data.videos;
    },
    play: function (videoId, chapterIndex, startTime) {
      addCurrentToHistory();
      setVideo(videoId);
      setChapter(chapterIndex, startTime);
      Tracker.collect({action: 'player_play', id: data.currentVideo.id, time: data.currentTime});
    },
    setChapterIndex: function (chapterIndex) {
      addCurrentToHistory();
      setChapter(chapterIndex);
      Tracker.collect({action: 'player_play', id: data.currentVideo.id, time: data.currentTime});
    },
    seek: function (time) {
      findChapter(time);
    },
    signOut: function () {
      Tracker.collect({action: 'user_logout'});
      data.user = null;
    },
    resetPlay: function () {
      data.currentVideo = data.currentChapter = data.currentChapterIndex = data.currentTime = null;
    },
    setBeaming: function (beaming) {
      data.beaming = beaming;
      return data.beaming;
    },
    getVideo: function () {
      return data.currentVideo;
    },
    getChapter: function () {
      return data.currentChapter;
    },
    getChapterIndex: function () {
      return data.currentChapterIndex;
    },
    getTime: function () {
      return data.currentTime;
    },
    isBeaming: function () {
      return data.beaming;
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
    },
    getHistory: function () {
      return data.history;
    }
  };
}
