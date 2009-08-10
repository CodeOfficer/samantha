(function($) {
  // $(function() {
    with(jqUnit) {

      context('Samantha', {})
      .should('contain objects', function() {
        isType(Samantha.Application, Function);
        isType(Samantha.Core, Function);
        isType(Samantha.EventContext, Function);
        isType(Samantha.Router, Function);
        isType(Samantha.Object, Object);
        matches(/^(\d+)\.(\d+)\.(\d+)$/, Samantha.VERSION);
      });

      context('Samantha.Application', 'init', {
        before: function() {
          this.app1 = new $.samantha(function() { 
            this.random_setting = true;
          });
          this.app2 = new $.samantha(function() { 
            this.random_setting = true;
          });
        }
      })
      .should('set arbitrary settings in the app', function() {
        equals(this.app1.random_setting, true);
      })
      .should('set a namespace as a random UUID', function() {
        matches(/^(\d+)-(\d{1,3})$/, this.app1.namespace);
      })
      .should('create unique namespaces for each app', function() {
        unique = (this.app1.namespace != this.app2.namespace)
        equals(unique, true);
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
  // });
})(jQuery);
