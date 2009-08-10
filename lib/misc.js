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
    Samantha.Router = function(){};
    
    Samantha.Router.prototype = {
      _routes: [],
      add: function(x) {
        this._routes.push(x);
      },
      remove: function(x) {
        this._routes.pop(x);
      },
      log: function(x) {
        console.log(this._routes.join(', '));
      }
    };
    
  
  // common app methods
  Samantha.Mixin = function(){

  };
  
  // app instances
  Samantha.Application = function(app_function){
    this.init(app_function);
    this.namespace = this.uuid();
    app_function.apply(this);
    console.log(this.eventNamespace());
  };
  
  Samantha.Application.prototype = {
    data_store_name: 'samantha-app',
    init: function(app_function){
      console.log(this, 'init was called');
    },
    run: function(){
      console.log(this, 'run was called');
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
  };
  
  $.samantha = function(app_function) {
    return new Samantha.Application(app_function);
  };

})(jQuery);