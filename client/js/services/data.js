'use strict';

angular.module('Data', ['ngResource']).factory('Data', data);

function data() {
  return {
    video: null
  };
}
