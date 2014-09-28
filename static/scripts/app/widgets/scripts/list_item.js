define(function(require) {
    var Backbone = require('backbone');
    var React = require('react');
    var State = require('app/models/state');

    var ScriptListItemWidget = React.createClass({

        propTypes: {
            // model
        },

        componentWillMount: function() {
            this._ofp_state = State.find_by_name("Furby");
        },

        componentDidMount: function() {
            this._ofp_state.on('add remove change', this._update, this);
        },

        componentWillUnmount: function() {
            this._ofp_state.off(null, null, this);
        },

        render: function() {
            var m = this.props.model;
            var name = m.get('name');
            var url = '/script/' + encodeURIComponent(name);
            var selected = this._ofp_state.get('script_name') === name;
            return (
                <a className={ "script-list-item-widget rewrite " + (selected ? "selected" : "")} href={url} onClick={ this._click }>
                    <h5>{name}</h5>
                </a>
            );
        },

        _click: function() {
            this._ofp_state.set('script_name', this.props.model.get('name'));
        },

        _update: function() {
            if (this.isMounted()) { this.forceUpdate(); }
        }
    });

    return ScriptListItemWidget;
});
