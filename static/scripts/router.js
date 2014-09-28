define(function(require) {
    'use strict';
    var React = require('react');
    var HeaderWidget = require('jsx!app/widgets/header');
    var HomePage = require('jsx!app/pages/home');
    var ScriptsCollection = require('app/collections/scripts');
    var container = document.getElementsByClassName('container-fluid')[0];
    var header_container = document.getElementsByClassName('header-container')[0];

    $(document).on('click', 'a.rewrite', function(e) {
        if (e.which === 2 || e.ctrlKey || e.metaKey) { return; }

        var self = $(this);
        var href = self.attr('href');
        Backbone.history.navigate(href);
        e.preventDefault();
        return false;
    });

    var Router = Backbone.Router.extend({
        routes: {
            '(script/:id)': 'script',
        },

        initialize: function() {
            Backbone.history.start()

            this._header = <HeaderWidget />;
            React.renderComponent(this._header, header_container);
        },

        script: function() {
            this._scripts = new ScriptsCollection();
            this._home = <HomePage collection={this._scripts} />;
            React.renderComponent(this._home, container);
        }

    });

    var router = window.router = new Router();
});

