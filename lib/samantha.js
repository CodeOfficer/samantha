(function($){

  Samantha = {};
  Samantha.VERSION = '0.0.0';
  
// ----------------------------------------------------------------------------

  Samantha.Object = {};
  
  Samantha.Object.prototype = {

    clone: function(obj) {
      if (typeof obj == 'undefined') obj = this;
      return $.extend({}, obj);
    },
    
    toHash: function() {
      var json = {}; 
      this.each(function(k,v) {
        if (!$.isFunction(v)) {
          json[k] = v
        }
      });
      return json;
    },

    toHTML: function() {
      var display = "";
      this.each(function(k, v) {
        if (!$.isFunction(v)) {
          display += "<strong>" + k + "</strong> " + v + "<br />";
        }
      });
      return display;
    },

    each: function() {
      var context, object, callback, bound_callback;
      context = this;
      if (typeof arguments[0] != 'function') {
        object = arguments[0];
        callback = arguments[1];
      } else {
        object = this;
        callback = arguments[0];
      }
      bound_callback = function() {
        return callback.apply(context, arguments);
      }
      $.each(object, bound_callback);
    },
    
    uuid: function() {
      if (typeof this._uuid == 'undefined' || !this._uuid) {
        this._uuid = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000);
      }
      return this._uuid;
    },
    
    log: function()	{
      var args = [].slice.call(arguments);
      args.unshift("[" + Date() + "]");
			if (typeof window.console != 'undefined') {
					window.console.log.apply(window.console, args);
			} else if (typeof console != 'undefined') {
				console.log.apply(this, args);
			} else {
				// do nothing
			}
			
		}
    
  };

// ----------------------------------------------------------------------------

  Samantha.Core = function(){

  };
  
  Samantha.Core.prototype = $.extend({}, Samantha.Object.prototype, {
    
  });
  
// ----------------------------------------------------------------------------

  Samantha.EventContext = function(){

  };
  
  Samantha.EventContext.prototype = $.extend({}, Samantha.Object.prototype, {
    
  });

// ----------------------------------------------------------------------------

  Samantha.Router = function(){};

  Samantha.Router.prototype = $.extend({}, Samantha.Object.prototype, {
  // Samantha.Router.prototype = {
        
    _routes: [],
    
    _events: [],
    
    add_route: function(x) {
      this._routes.push(x);
    },
    
    remove_route: function(x) {
      this._routes.pop(x);
    },
    
    log_routes: function(x) {
      // console.log(this._routes.join(', '));
      return this._routes.join(', ');
    }
    
  });    

// ----------------------------------------------------------------------------

  Samantha.Application = function(app_function){
    this.namespace = this.uuid();
    this.router = new Samantha.Router;

    // define the defualt GET and POST routes
    this.each(this.ROUTE_VERBS, function(i, verb) {
      this._defineRouteShortcut(verb);
    });

    this.init(app_function);
  };
  
  Samantha.Application.prototype = $.extend({}, Samantha.Object.prototype, {
    
    ROUTE_VERBS: ['get','post'],

    data_store_name: 'samantha-app',
    
    init: function(app_function){
      app_function.apply(this);
    },
    
    run: function(){
    },
    
    uuid: function() {
      if (typeof this._uuid == 'undefined' || !this._uuid) {
        this._uuid = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000);
      }
      return this._uuid;
    },
    
    eventNamespace: function() {
      return this.data_store_name + '-' + this.namespace + '-';
    },
    
    route: function(verb, path, callback) {
      var app = this;
      console.log(verb, path, callback);
    },
      
    _defineRouteShortcut: function(verb) {
      var app = this;
      this[verb] = function(path, callback) {
        app.route.apply(app, [verb, path, callback]);
      };
    }
    
  });
  
// ----------------------------------------------------------------------------

  $.samantha = function(app_function) {
    return new Samantha.Application(app_function);
  };

})(jQuery);