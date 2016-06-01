var routesClass = Backbone.Collection.extend({
    url: 'http://localhost:3000/db/routes.json'
});

App.Routes = new routesClass();