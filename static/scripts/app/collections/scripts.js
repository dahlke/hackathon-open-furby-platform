define(function(require) {
    var Backbone = require('backbone');
    var ScriptModel = require('app/models/script');

    var ScriptCollection = Backbone.Collection.extend({
        url: '/scripts',
        model: ScriptModel
    });

    return ScriptCollection;
});
