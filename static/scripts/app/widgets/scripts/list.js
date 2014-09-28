define(function(require) {
    var Backbone = require('backbone');
    var React = require('react');
    var State = require('app/models/state');
    var ScriptsListItemWidget = require('jsx!app/widgets/scripts/list_item');

    var ScriptListWidget = React.createClass({

        propTypes: {
            // collection
        },

        componentWillMount: function() {
            this._ofp_state = State.find_by_name("Furby");
        },

        componentDidMount: function() {
            this.props.collection.on('add remove change', this._update, this);
            this._ofp_state.on('change', this._update, this);
        },

        componentWillUnmount: function() {
            this.props.collection.off(null, null, this);
        },

        render: function() {
            var items = _.map(this.props.collection.models, function(m) {
                return <ScriptsListItemWidget model={m} />
            });

            var selected = this._ofp_state.get('script_name');
            var model = this.props.collection.get(selected);
            /*
                <button className="btn btn-default pull-right" onClick={this._create}>
                    <i className="fa fa-file-o" />
                </button>
            */
            return (
                <div className="script-list-widget">
                    { items }
                </div>
            );
        },

        _update: function() {
            if (this.isMounted()) { this.forceUpdate(); }
        },

        _create: function(e) {
            e.preventDefault();
            this._ofp_state.set('script_name', undefined);
            return false;
        },

    });

    return ScriptListWidget;
});
