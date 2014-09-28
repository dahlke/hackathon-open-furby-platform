define(function(require) {
    var React = require('react');
    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
    var State = require('app/models/state');

    var NotificationsWidget = React.createClass({

        getInitialState: function() {
            return {
                text: undefined,
                type: undefined
            };
        },

        componentWillMount: function() {
            this._ofp_state = State.find_by_name("Furby");
        },

        componentDidMount: function() {
            this._ofp_state.on('change', this._update, this);
        },

        componentWillUnmount: function() {
            this._ofp_state.off(null, null, this);
        },

        render: function() {
            var noti =  this.state.text ? (
                <div className={ "alert alert-" + this.state.type }>
                    <button type="button" className="close" onClick={this._click}>
                        <span>&times;</span>
                    </button>
                    { this.state.text }
                </div>
            ) : undefined;

            return (
                <ReactCSSTransitionGroup transitionName="fade-in">
                    {noti}
                </ReactCSSTransitionGroup>
            );
        },


        _update: function() {
            var noti = this._ofp_state.get('notification');
            if (noti) {
                this.setState({ text: noti.msg, type: noti.type })
                setTimeout(_.bind(function() {
                    this.setState({text: undefined, type: undefined});
                    this._ofp_state.set('notification', undefined);
                }, this), noti.timeout || 3000);
            }
        },

        _click: function() {
            this.setState({text: undefined, type: undefined});
        }

    });

    return NotificationsWidget;
});
