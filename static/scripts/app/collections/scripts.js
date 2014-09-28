define(function(require) {
    var Backbone = require('backbone');
    var ScriptModel = require('app/models/script');

    var ScriptCollection = Backbone.Collection.extend({
        url: '/scripts',
        comparator: function(a, b) {
            return a.get('created') < b.get('created') ? 1 : -1;
        },
        model: ScriptModel
    });

    return ScriptCollection;
});
