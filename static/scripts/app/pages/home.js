define(function(require) {
    var Backbone = require('backbone');
    var React = require('react');
    var EditorWidget = require('jsx!app/widgets/editor');
    var ScriptsListWidget = require('jsx!app/widgets/scripts/list');
    var State = require('app/models/state');

    var HomePage = React.createClass({

        componentWillMount: function() {
            this._ofp_state = State.get_or_default("Furby", { script_name: undefined })
            this.props.collection.fetch();
        },

        render: function() {
            return (
                <div className="home-page">
                    <div className="col-md-4">
                        <h3>Scripts</h3>
                        <ScriptsListWidget collection={this.props.collection} />
                    </div>
                    <div className="col-md-8">
                        <EditorWidget collection={this.props.collection} />
                    </div>
                </div>
            );
        }
    });

    return HomePage;
});
