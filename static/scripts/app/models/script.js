define(function(require) {
    var Backbone = require('backbone');

    var ScriptModel = Backbone.Model.extend({
        url: 'script',
        idAttribute: 'name'
    });

    return ScriptModel;
});
