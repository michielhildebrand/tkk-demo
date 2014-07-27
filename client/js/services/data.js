'use strict';

angular.module('Data', ['ngResource']).factory('Data', data);

function data() {
  var data = {};

  return {
    getVideo: function () {
      return data.video;
    },
    setVideo: function (video) {
      data.video = video;
    }
  };
}
