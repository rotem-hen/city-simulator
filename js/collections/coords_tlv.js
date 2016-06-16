var coordsClass = Backbone.Collection.extend({
  url: '/db/coords_tlv.json'
});

App.Coords_tlv = new coordsClass();