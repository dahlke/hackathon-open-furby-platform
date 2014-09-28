define(function(require) {
    var Backbone = require('backbone');
    var React = require('react');
    var EditorWidget = require('jsx!app/widgets/editor');
    var ScriptsListWidget = require('jsx!app/widgets/scripts/list');
    var NotificationsWidget = require('jsx!app/widgets/notifications');
    var State = require('app/models/state');

    var HomePage = React.createClass({

        componentWillMount: function() {
            this._ofp_state = State.get_or_default("Furby", { script_name: undefined })
            this.props.collection.fetch();
        },

        render: function() {
            return (
                <div className="home-page">
                    <NotificationsWidget />
                    <div className="col-md-4">
                        <h3>Scripts</h3>
                        <button className="btn btn-xs btn-default create" onClick={this._create}>
                            <i className="fa fa-file-o" /> add new
                        </button>
                        <ScriptsListWidget collection={this.props.collection} />
                    </div>
                    <div className="col-md-8">
                        <EditorWidget collection={this.props.collection} />
                    </div>
                </div>
            );
        },

        _create: function(e) {
            e.preventDefault();
            this._ofp_state.set('script_name', undefined);
            return false;
        }
    });

    return HomePage;
});
