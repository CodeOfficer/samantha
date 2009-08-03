(function($){

  Samantha = {};

  Samantha.VERSION = '0.0.0';

  // keep track of apps
  Samantha.Core = function(){

  };
  
  // safe env for events to run in
  Samantha.EventContext = function(){

  };
  
  // subscribe and publish, a singleton
  Samantha.Router = function(){

  };
  
  // common app methods
  Samantha.Mixin = function(){

  };
  
  // app instances
  Samantha.Application = function(){

  };
  
  $.samantha = function(app_function) {
    return new Samantha.Application(app_function);
  };

})(jQuery);