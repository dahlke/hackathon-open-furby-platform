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
            $(window).on('resize', this._resize);
            this._resize();
        },

        componentWillUnmount: function() {
            this.props.collection.off(null, null, this);
            $(window).off('resize');
        },

        render: function() {
            var items = _.map(this.props.collection.models.sort(), function(m) {
                return <ScriptsListItemWidget model={m} key={'script-list-' + m.cid}/>
            });

            var selected = this._ofp_state.get('script_name');
            var model = this.props.collection.get(selected);
            return (
                <div className="script-list-widget">
                    { items }
                </div>
            );
        },

        _update: function() {
            if (this.isMounted()) { this.forceUpdate(); }
        },

        _resize: function() {
            $('.script-list-widget').height($(window).height() - 130);
        }

    });

    return ScriptListWidget;
});
