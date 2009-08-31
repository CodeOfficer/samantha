(function($){

  Samantha = {};
  Samantha.VERSION = '0.0.0';
  Samantha.PATH_PREFIX_MATCHER = /^#\//;
  Samantha.PATH_REPLACER = "([^\/]+)";
  Samantha.PATH_NAME_MATCHER = /:([\w\d]+)/g;
  
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
          json[k] = v;
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
      };
      $.each(object, bound_callback);
    },
    
    uuid: function() {
      if (typeof this._uuid == 'undefined' || !this._uuid) {
        this._uuid = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000, 10);
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

  Samantha.EventContext = function(){

  };
  
  Samantha.EventContext.prototype = $.extend({}, Samantha.Object.prototype, {
    test: true
  });

// ----------------------------------------------------------------------------

  Samantha.Router = function(key) {
    this.key = key;
    this._routes = {};
    this._events = [];
    this.init();
  };
  
  Samantha.Router.prototype = $.extend({}, Samantha.Object.prototype, {
    
    init: function(){
      this.listenForRoutes();
    },
    
    // bindTriggers: function() {
    //   var router = this;
    //   $('a:not(.ignore)').live('click', function(e) {
    //     var path = $(this).attr('href');
    //     console.log('click', path, this);
    //     if (path.match(Samantha.PATH_PREFIX_MATCHER)) {
    //       $(this).trigger('click.samantha', [this, path]);
    //       e.preventDefault();
    //     } else {
    //       return true;
    //     }
    //   });
    //   
    //   $('form:not(.ignore)').live('submit', function(e) {
    //     var path = $(this).closest('form').attr('href');
    //     console.log('submit', path);
    //     if (path.match(Samantha.PATH_PREFIX_MATCHER)) {
    //       $(this).trigger('submit.samantha', [this, path]);
    //       e.preventDefault();
    //     } else {
    //       return true;
    //     }
    //     
    //     
    //     $(this).trigger('submit.samantha', this);
    //     e.preventDefault();
    //   });      
    // },
    
    // switch(e.type)
    // {
    //   case 'click':
    //     result.type = 'click';
    //     result.path = $(e.target).attr('href');
    //     result.target = $(e.target);
    //     router._events.push(result);
    //     console.log('heard click', result.path);
    //     break;
    //   case 'submit':
    //     console.log('heard submit');
    //     result.type = 'submit';
    //     result.path = $(e.target).closest('form').attr('action');
    //     result.target = $(e.target);
    //     router._events.push(result);
    //     break;
    // }
    
    // is it an event we care about (click, keypress)
    // is it a node we care about 
      // does its path math
    // look for a route with this path
    // trigger it (them?)
    
    // _isLinkTarget: function(target) {
    //   if (target.nodeName.toUpperCase() == 'A') {
    //     return true;
    //   } else {
    //     return false;
    //   };
    // },
    
    lookupRoute: function(verb, path) {
      var routed = false;
      if (typeof this._routes[verb] != 'undefined') {
        $.each(this._routes[verb], function(i, route) {
          if (path.match(route.path)) {
            routed = true;
          }
        });
      }
      return routed;
    },
    
    listenForRoutes: function() {
      var router = this;

      $(document).bind('click.samantha keypress.samantha', function(e){
        
        var routeFound = false;
        var $target = $(e.target);
        var $form = null;
        var verb = null;
        var path = null;
        var params = {};
        // var targetNodeName = target.nodeName.toUpperCase();
        // var targetType = e.target.type.toLowerCase();

        if (e.type === 'click') {
          switch(e.target.nodeName.toUpperCase())
          {
            case 'A':
              verb = 'get';
              path = $target.attr('href');
              routeFound = router.lookupRoute(verb, path);
              break;
            case 'INPUT':
              $form = $target.closest('form');
              verb = $form.attr('method').toString().toLowerCase();
              path = $form.attr('action');
              $form.find(':input[type!=submit]').each(function() {
                params[$(this).attr('name')] = $(this).val();
              });
              routeFound = router.lookupRoute(verb, path);
              break;
            case 'BUTTON':
              $form = $target.closest('form');
              verb = $form.attr('method').toString().toLowerCase();
              path = $form.attr('action');
              $form.find(':input[type!=submit]').each(function() {
                params[$(this).attr('name')] = $(this).val();
              });
              routeFound = router.lookupRoute(verb, path);
              break;
            // default:
            //   return true;
          };
          
          if (routeFound) {
            router.runRoute(verb, path, params);
            return false;
          } else {
            // do nothing
          };
        };
        
        // return key in a form
        if (e.type === 'keypress' && e.target.nodeName.toUpperCase()=='INPUT' && e.keyCode == 13) {
          router.runRoute(verb, path, params);
          return false;
        };

      });
      
    },
    
    runRoute: function(verb, path, params) {
      console.log("running route: ", verb, path, params);
    },
    
    route: function(app, verb, path, callback) {      
      var param_names = [];
      if (path.constructor == String) {
        // find the names
        while ((path_match = Samantha.PATH_NAME_MATCHER.exec(path)) != null) {
          param_names.push(path_match[1]);
        }
        // replace with the path replacement
        path = new RegExp(path.replace(Samantha.PATH_NAME_MATCHER, Samantha.PATH_REPLACER) + "$");
      }
      var r = { app:app, verb: verb, path: path, callback: callback, param_names: param_names };
      if (typeof this._routes[verb] == 'undefined' || this._routes[verb].length == 0)  {
        this._routes[verb] = [r];
      } else {
        this._routes[verb].push(r);
      }
      return r;
    },
    
    num_routes: function() {
      var num = 0, routes = this._routes;      
      $.each(routes, function(i, val) {
        num += routes[i].length;
      });
      return num;
    }
    
  }); 

// ----------------------------------------------------------------------------  
  
  Samantha.RouterFactory = function() {
    
  };
  
  Samantha.RouterFactory.prototype = $.extend({}, Samantha.Object.prototype, {
    
    routers: {},
    
    getRouterInstanceFor: function(key){
      if (this.routers[key] === undefined) {
        this.routers[key] = new Samantha.Router(key);
      };
      return this.routers[key];
    }
    
  });

// ----------------------------------------------------------------------------

  Samantha.Application = function(app_function){
    this.namespace = this.uuid();
    this.router = new Samantha.RouterFactory().getRouterInstanceFor('samantha');
    this.context_prototype = $.extend({}, Samantha.EventContext.prototype);
    
    // define the defualt GET and POST routes
    this.each(this.ROUTE_VERBS, function(i, verb) {
      this._defineRouteShortcut(verb);
    });

    this.init(app_function);
  };
  
  Samantha.Application.prototype = $.extend({}, Samantha.Object.prototype, {
    
    ROUTE_VERBS: ['get','post', 'put', 'destroy'],
    
    element_selector: 'body',
    
    _running: false,
    
    init: function(app_function){
      app_function.apply(this);
    },
    
    run: function(){
      if (this._running) { return; };
      this._running = true;
    },
    
    unload: function(){
      if (!this._running) { return; };
      this._running = false;
    },
    
    $element: function() {
      return $(this.element_selector);
    },
    
    isRunning: function() {
      return this._running;
    },

    toString: function() {
      return 'Sammy.Application:' + this.element_selector;
    },
    
    eventNamespace: function() {
      return this.data_store_name + '-' + this.namespace + '-';
    },
    
    route: function(verb, path, callback) {
      var app = this;
      this.router.route(app, verb, path, callback);
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
