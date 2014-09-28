define(function(require) {
    var React = require('react');

    var HeaderWidget = React.createClass({

        render: function() {
            return (
                <nav className="header-widget navbar navbar-default container-fluid" role="navigation">
                    <div className="navbar-header">
                        <span className="navbar-brand" href="#">
                            <img className="logo" src="static/images/logo.png" />
                            <span>Open Furby Platform</span>
                        </span>
                    </div>
                </nav>
            );
        }

    });

    return HeaderWidget;
});
