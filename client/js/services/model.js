'use strict';

angular.module('Model', []).factory('Model', ['$log', 'Tracker', model]);

function model($log, Tracker) {
  var data = {
    user: null,
    videos: [],
    currentVideo: null,
    currentChapter: null,
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
  }

  function findChapter(time) {
    var ch = _.chain(data.currentVideo.chapters)
      .filter(function (ch) {
        return ch.startTime <= time;
      }).min(function (ch) {
        return time - ch.startTime;
      }).value();
    if (ch != Infinity) {
      setChapter(ch.id, time);
    } else {
      debug('No chapter at this time: ' + time);
    }
  }

  function setChapter(chId, startTime) {
    var ch = _(data.currentVideo.chapters).find(function (c) {
      return c.id == chId;
    });
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
      .map(function(f, index) {
        f.index = index;
        return f;
      }).filter(function (f) {
        return f.startTime <= startTime;
      }).min(function (f) {
        return startTime - f.startTime;
      }).value();
    if (fr != Infinity) {
      debug('Set fragment: ' + fr.index + ' - ' + fr.title + ' - ' + fr.startTime);
      data.currentFragment = fr;
    } else {
      debug('No fragment at this time: ' + startTime);
      data.currentFragment = null;
    }
  }

  function addCurrentToHistory() {
    if (data.currentVideo != null && data.currentChapter != null) {
      data.history.push({video: data.currentVideo, chapter: data.currentChapter});
    }
  }

  function hasChanged(videoId, chapterId, startTime) {
    var hasChanged = true;
    if (videoId == null || (data.currentVideo != null && data.currentVideo.id == videoId)) {
      if (chapterId == null || (data.currentChapter != null && data.currentChapter.id == chapterId)) {
        if (startTime == null || (data.currentTime != null && data.currentTime == startTime)) {
          hasChanged = false;
        } else {
          debug('Time has changed: ' + data.currentTime + ' -> ' + startTime);
        }
      } else {
        debug('Chapter has changed: ' + (data.currentChapter ? data.currentChapter.id : 'none') + ' -> ' + chapterId);
      }
    } else {
      debug('Video has changed: ' + (data.currentVideo ? data.currentVideo.id : 'none') + ' -> ' + videoId);
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
    play: function (videoId, chapterId, startTime) {
      if (hasChanged(videoId, chapterId, startTime)) {
        addCurrentToHistory();
        setVideo(videoId);
        setChapter(chapterId, startTime);
        Tracker.collect({action: 'player_play', id: data.currentVideo.id, time: data.currentTime});
      } else {
        debug('Wanted to play but nothing has changed');
      }
    },
    setChapterId: function (chId) {
      if (hasChanged(null, chId, null)) {
        addCurrentToHistory();
        setChapter(chId);
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
      data.currentVideo = data.currentChapter = data.currentFragment = data.currentTime = null;
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
