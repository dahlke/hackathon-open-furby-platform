define(function(require) {
    var Backbone = require('backbone');

    var StateData = Backbone.Model.extend({
        initialize: function(initial_state, name) {
            this.name = name;
            var parts = this.name.split('.');
            if (parts.length >= 2) {
                this.namespace = parts[0];
            }
        },

        has_namespace: function(namespace) {
            return this.namespace === namespace;
        },

        sync: function(method, model, options) {
            options.success({});
        }
    });

    var State = Backbone.Collection.extend({
        StateData: StateData,

        serialize: function(namespace) {
            return _.transform(this.models, function(result, state) {
                if (!namespace || (namespace && state.has_namespace(namespace))) {
                    result[state.name] = state.toJSON();
                }
            }, {});
        },

        // Most likely not used currently
        load: function(serialized_state) {
            _.each(serialized_state, function(state, name) {
                var state_model = this.find_by_name(name);
                if (state_model) {
                    state_model.clear({ silent: true });
                    state_model.set(state);
                } else {
                    state_model = new StateData(state, name);
                    this.add(state_model);
                }
                state_model.trigger('load');
            }, this);

            // delete any state data that is no longer relevant
            for (var i = this.models.length - 1; i >= 0; --i) {
                var state = this.models[i];
                if (!_.has(serialized_state, state.name)) {
                    state.off();
                    this.remove(state);
                }
            }
        },

        clear: function(namespace) {
            for (var i = this.models.length - 1; i >= 0; --i) {
                var model = this.models[i];
                if (!namespace || (namespace && model.has_namespace(namespace))) {
                    model.off();
                    this.remove(state);
                }
            }
        },

        find_by_name: function(name) {
            return _.find(this.models, function(s) { return s.name === name; });
        },

        get_or_default: function(name, default_state) {
            var state_model = this.find_by_name(name);
            if (state_model) {
                return state_model;
            } else {
                state_model = new StateData(default_state, name);
                this.add(state_model);
                return state_model;
            }
        }
    });

    return new State();
});
