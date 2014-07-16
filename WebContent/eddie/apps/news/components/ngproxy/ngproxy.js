var Ngproxy = function(options) {
  self.putMsg = function(jsonString) {
    var msg = JSON.parse(jsonString);
    angular.element(document.body).injector().get('eventsBus').publish(msg.target, msg.data);
  };
  return self;
};
