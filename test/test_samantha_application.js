(function($) {
  // $(function() {
    with(jqUnit) {
      
      context('Samantha.Application', 'init', {
        before: function() {
          this.app = new Samantha.Application(function() {
            this.random_setting = 1;
          });
        }
      })
      .should('create a samantha object', function() {
        defined(this.app, 'route');
      })
      .should('set arbitrary settings in the app', function() {
        equals(this.app.random_setting, 1);
      })
      .should('set namespace as random UUID', function() {
        matches(/^(\d+)-(\d{1,3})$/, this.app.namespace);
      })
      .should('initialize empty routes object', function() {
        isType(this.app.routes, Object);
      });
      
    }
  // });
})(jQuery);
