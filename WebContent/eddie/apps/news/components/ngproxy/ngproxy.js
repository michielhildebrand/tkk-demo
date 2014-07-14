
var Ngproxy = function(options) {
  var self = {};
  var settings = {};
  $.extend(settings, options);

  self.putMsg = function(string) {
    console.log(string);
    var msg = JSON.parse(string);

    var bus = angular.element(document.body).injector().get('eventsBus');
    bus.publish(msg.target, msg.data);
  };

  return self;
};