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
    
  });

// ----------------------------------------------------------------------------

  Samantha.Router = function(key) {
    this.key = key;
    this._routes = [];
  };
  
  Samantha.Router.prototype = $.extend({}, Samantha.Object.prototype, {
    
    PATH_REPLACER: "([^\/]+)",
    
    PATH_NAME_MATCHER: /:([\w\d]+)/g,
    
    // _events: [],
    
    // init: function(){
    //   console.log('• router is init');
    // },
    
    bind_listeners: function(app, dom) {
      // $(this._element_selector, dom).bind('click.samantha submit.samantha', function(e){
      //   var result = { e:e, type:e.type, path:'', callback:'', params:{}, target:'' };
      //   switch(e.type)
      //   {
      //     case 'click':
      //       result.type = 'click';
      //       result.path = $(e.target).attr('href');
      //       result.target = $(e.target);
      //       // Samantha.events.push(result);
      //       break;
      //     case 'submit':
      //       result.type = 'submit';
      //       result.path = $(e.target).closest('form').attr('action');
      //       result.target = $(e.target);
      //       // Samantha.events.push(result);
      //       break;
      //   }
      //   console.log('CLICKED', app);
      // });
    },
    
      // var samantha_click = function(e) {
      //   var path = $(this).attr('href');
      //   if (path.match(/^#\//)) {
      //     $(this).trigger('clicked.samantha', [this, path]);
      //     e.preventDefault();
      //   } else {
      //     return true;
      //   }
      // };
      // 
      // var samantha_submit = function(e) {
      //   $(this).trigger('submitted.samantha', this);
      //   e.preventDefault();
      // };
    
    route: function(app, verb, path, callback) {
      console.log('registering route: ', app, verb, path, callback);
      this._routes.push([app, verb, path, callback]);
      // console.log(this._routes);
      var param_names = [];
      // // if path is a string turn it into a regex
      // if (path.constructor == String) {
      //   // find the names
      //   while ((path_match = PATH_NAME_MATCHER.exec(path)) != null) {
      //     param_names.push(path_match[1]);
      //   }
      //   // replace with the path replacement
      //   path = new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
      // }
      // var r = { app: app, verb: verb, path: path, callback: callback, param_names: param_names };
      // // this._routes.push(app, verb, path, callback);
      // 
      // // add route to routes array
      // if (typeof this.routes[verb] == 'undefined' || this.routes[verb].length == 0)  {
      //   // add to the front of an empty array
      //   this.routes[verb] = [r];
      // } else {
      //   // place in order of longest path first
      //   var placed = false;
      //   this.each(this.routes[verb], function(i, route)  {
      //     if (path.toString().length >= route.path.toString().length) {
      //       this.routes[verb].splice(i, 0, r);
      //       placed = true;
      //       // exit each()
      //       return false; 
      //     }
      //   });
      //   // not placed? path is the shortest seen so far. append to the end
      //   if (!placed) {
      //     this.routes[verb].push(r);
      //   }
      // }
      // // return the route
      // return r;
    },
    
    reset_all_routes: function(x) {
      this._routes = [];
    },
    
    // remove_route: function(x) {
    //   this._routes.pop(x);
    // },
    
    // log_routes: function(x) {
    //   // console.log(this._routes.join(', '));
    //   return this._routes.join(', ');
    // },
    
    num_routes: function() {
      return this._routes.length;
    }
    
  }); 

// ----------------------------------------------------------------------------  
  
  Samantha.RouterFactory = function() {};
  
  Samantha.RouterFactory.prototype = $.extend({}, Samantha.Object.prototype, {
    
    routers: {},
    
    getRouterInstance: function(key){
      if (this.routers[key] === undefined) {
        this.routers[key] = new Samantha.Router(key);
      };
      return this.routers[key];
    }
    
  });

// ----------------------------------------------------------------------------

  Samantha.Application = function(app_function){
    this.namespace = this.uuid();
    this.router = new Samantha.RouterFactory().getRouterInstance('samantha');
    // define the defualt GET and POST routes
    this.each(this.ROUTE_VERBS, function(i, verb) {
      this._defineRouteShortcut(verb);
    });

    this.init(app_function);
  };
  
  Samantha.Application.prototype = $.extend({}, Samantha.Object.prototype, {
    
    data_store_name: 'samantha-app',
    
    ROUTE_VERBS: ['get','post', 'put', 'delete'],
    
    element_selector: document,
    
    _running: false,
    
    init: function(app_function){
      app_function.apply(this);
    },
    
    run: function(){
      if (this._running) { return };
      // this.router.bind_listeners(this, this.element_selector);
    },
    
    unload: function(){
      if (!this._running) { return };
      // this.router.unbind_listeners(this, this.element_selector);
    },
    
    uuid: function() {
      if (typeof this._uuid == 'undefined' || !this._uuid) {
        this._uuid = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000, 10);
      }
      return this._uuid;
    },
    
    $element: function() {
      return $(this.element_selector);
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