'use strict';

angular.module('Model', []).factory('Model', ['$log', 'Tracker', model]);

function model($log, Tracker) {
  var data = {
    user: null,
    videos: [],
    currentVideo: null,
    currentVideoId: null,
    currentChapter: null,
    currentChapterIndex: null,
    currentFragment: null,
    currentTime: null,
    beaming: false,
    bookmarks: [],
    history: []
  };

  function setVideo(id) {
    var v = _(data.videos).find(function (v) {
      return v.id == id;
    });
    debug('Set video: ' + v.id + ' - ' + v.title);
    data.currentVideo = v;
    data.currentVideoId = v.id
  }

  function findChapter(time) {
    var ch = _.chain(data.currentVideo.chapters)
      .map(function (ch, index) {
        return {ch: ch, idx: index};
      }).filter(function (o) {
        return o.ch.startTime <= time;
      }).min(function (o) {
        return time - o.ch.startTime;
      }).value();
    if (ch != Infinity) {
      setChapter(ch.idx, time);
    } else {
      debug('No chapter at this time: ' + time);
    }
  }

  function setChapter(index, startTime) {
    var chIdx = parseInt(index);
    data.currentChapterIndex = chIdx;
    var ch = data.currentVideo.chapters[chIdx];
    if (startTime == null) {
      data.currentTime = ch.startTime;
    } else {
      data.currentTime = startTime;
    }
    debug('Set chapter: ' + ch.id + ' - ' + ch.title + ' - ' + ch.startTime);
    data.currentChapter = ch;
    findAndSetFragment(data.currentTime);
  }

  function findAndSetFragment(startTime) {
    var fr = _.chain(data.currentChapter.fragments)
      .filter(function (f) {
        return f.startTime <= startTime;
      }).min(function (f) {
        return startTime - f.startTime;
      }).value();
    if (fr != Infinity) {
      debug('Set fragment: ' + fr.id + ' - ' + fr.title + ' - ' + fr.startTime);
      data.currentFragment = fr;
    } else {
      debug('No fragment at this time: ' + startTime);
      data.currentFragment = null;
    }
  }

  function addCurrentToHistory() {
    if (data.currentVideo != null && data.currentChapter != null) {
      data.history.push({video: data.currentVideo, chapter: data.currentChapter, index: data.currentChapterIndex});
    }
  }

  function hasChanged(videoId, chapterIndex, startTime) {
    var hasChanged = true;
    if (videoId == null || (data.currentVideoId == videoId)) {
      if (chapterIndex == null || (data.currentChapterIndex == chapterIndex)) {
        if (startTime == null || (data.currentTime == startTime)) {
          hasChanged = false;
        } else {
          debug('Time has changed: ' + data.currentTime + ' -> ' + startTime);
        }
      } else {
        debug('Chapter has changed: ' + data.currentChapterIndex + ' -> ' + chapterIndex);
      }
    } else {
      debug('Video has changed: ' + data.currentVideoId + ' -> ' + videoId);
    }
    return hasChanged;
  }

  function debug(msg) {
    $log.debug('[Model (service)] ' + msg)
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
      if (hasChanged(videoId, chapterIndex, startTime)) {
        addCurrentToHistory();
        setVideo(videoId);
        setChapter(chapterIndex, startTime);
        Tracker.collect({action: 'player_play', id: data.currentVideo.id, time: data.currentTime});
      }
    },
    setChapterIndex: function (chapterIndex) {
      if (hasChanged(null, chapterIndex, null)) {
        addCurrentToHistory();
        setChapter(chapterIndex);
        Tracker.collect({action: 'player_play', id: data.currentVideo.id, time: data.currentTime});
      }
    },
    sync: function (time) {
      if (hasChanged(null, null, time)) {
        findChapter(time);
      }
    },
    signOut: function () {
      Tracker.collect({action: 'user_logout'});
      data.user = null;
    },
    resetPlay: function () {
      data.currentVideo = data.currentVideoId = data.currentChapter = data.currentChapterIndex = data.currentTime = data.currentFragment = null;
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
    getFragment: function () {
      return data.currentFragment;
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
