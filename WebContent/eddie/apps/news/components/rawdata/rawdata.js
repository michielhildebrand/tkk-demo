
var Rawdata = function(options) {
  var self = {};

  var settings = {};
  $.extend(settings, options);

  self.putMsg = function(msg){
    //var slider = $('#slider').append('<div class="entity-list"></div>');
    console.log(eval(msg));
  };

  return self;
};