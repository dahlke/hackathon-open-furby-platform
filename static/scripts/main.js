require.config({
    paths: {
        jquery: 'vendor/jquery.2.1.0.min',
        backbone: 'vendor/backbone',
        underscore: 'vendor/underscore',
        react: 'vendor/react.dev',
        JSXTransformer: 'vendor/JSXTransformer',
        jsx: 'vendor/jsx',
        moment: 'vendor/moment.min',
        ace: 'vendor/ace/ace'
    },

    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        JSXTransformer: {
            exports: "JSXTransformer"
        }
    }
});

require(['jquery', 'jsx!router'], function($, Router) {});
