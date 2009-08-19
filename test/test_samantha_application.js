(function($) {
  with(jqUnit) {

// ----------------------------------------------------------------------------

    context('Samantha', {})
    .should('contain objects', function() {
      isType(Samantha.Application, Function);
      isType(Samantha.EventContext, Function);
      isType(Samantha.Router, Function);
      isType(Samantha.RouterFactory, Function);
      isType(Samantha.Object, Object);
      matches(/^(\d+)\.(\d+)\.(\d+)$/, Samantha.VERSION);
    });

// ----------------------------------------------------------------------------

    context('Samantha.Router', {
      before: function() { 
        this.router1 = new Samantha.RouterFactory(true).getInstance();
      }
    })
    .should('act like a singleton', function() {
      this.router1.route(null, 'get', '#/test1', function(){});
      this.router1.route(null, 'get', '#/test2', function(){});
      equals(this.router1.num_routes(), 2);
    })
    .should('extend Samantha.Object', function() {
      // this.router1 = new Samantha.Router;
      // this.router2 = new Samantha.Router;
      isType(this.router1.toHash, Function);
    });

// ----------------------------------------------------------------------------

    context('Samantha.EventContext', {
      before: function() {
        this.event_context = new Samantha.EventContext;
      }
    })
    .should('extend Samantha.Object', function() {
      isType(this.event_context.toHash, Function);
    });

// ----------------------------------------------------------------------------

    context('Samantha.Application', {
      before: function() {
        this.app1 = new $.samantha(function() { });
      }
    })
    .should('extend Samantha.Object', function() {
      isType(this.app1.toHash, Function);
    });


    context('Samantha.Application', 'init', {
      before: function() {
        this.app1 = new $.samantha(function() { 
          this.random_setting = true;
        });
        this.app2 = new $.samantha(function() { });
      }
    })
    .should('set arbitrary settings in the app', function() {
      equals(this.app1.random_setting, true);
    })
    .should('set a namespace as a random UUID', function() {
      matches(/^(\d+)-(\d{1,3})$/, this.app1.namespace);
    })
    .should('create a unique namespace for each app', function() {
      equals((this.app1.namespace == this.app2.namespace), false);
    });


    context('Samantha.Application', 'RANDOM TEST', {
      before: function() {
        this.app1 = new $.samantha(function() { 
          this.get('#/route_1', function() { 
            console.log('ran #/route_1');
          });
          this.route('post', '#/route_2', function() {
            console.log('ran #/route_2');
          });
        });
      }
    })
    .should('work', function() {
      // working on app's route and its integration with app.router
      ok(false);
    });


    // .should('set arbitrary settings in the app', function() {
    //   equals(this.app.random_setting, 1);
    // })
    // .should('set namespace as random UUID', function() {
    //   matches(/^(\d+)-(\d{1,3})$/, this.app.namespace);
    // })
    // .should('initialize empty routes object', function() {
    //   isType(this.app.routes, Object);
    // });

    // context('Samantha.Application', 'init', {
    //   before: function() {
    //     this.app = new Samantha.Application(function() {
    //       this.random_setting = 1;
    //     });
    //   }
    // })
    // .should('create a samantha object', function() {
    //   defined(this.app, 'route');
    // })
    // .should('set arbitrary settings in the app', function() {
    //   equals(this.app.random_setting, 1);
    // })
    // .should('set namespace as random UUID', function() {
    //   matches(/^(\d+)-(\d{1,3})$/, this.app.namespace);
    // })
    // .should('initialize empty routes object', function() {
    //   isType(this.app.routes, Object);
    // });
    
  }
})(jQuery);
