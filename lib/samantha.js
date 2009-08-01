(function($){

  Samantha = {};
  
  Samantha.Routeable = { 
    add_route: function(route) {
      if (!this.routes) {
        this.routes = [];
      }
      this.routes.push(route);
    },

    execute_routes: function() {
      if (!this.routes) {
        return;
      }
      for (var i=0; i<this.routes.length; i++) {
        this.routes[i].execute();
      }
    },

    mixin: function(subject) {
      for (var func in Samantha.Routeable) {
        if (func=='mixin') {
          continue;
        }
        subject[func] = Samantha.Routeable[func];
      }
    }
  };

  Samantha.Application = function(){};
  
  Samantha.Routeable.mixin(Samantha.Application);
  
  Samantha.Application.prototype.setTemperature = function(temp) {
    this.temp = temp;
    this.execute_routes();
  };

  Samantha.Application.prototype.getTemperature = function() {
    return this.temp;
  };

  
  $.samantha = function(app_function) {
    return new Samantha.Application(app_function);
  };

})(jQuery);