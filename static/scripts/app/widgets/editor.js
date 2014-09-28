define(function(require) {
    var React = require('react');
    var State = require('app/models/state');
    var ScriptModel = require('app/models/script');
    require('ace');

    var EditorWidget = React.createClass({

        getInitialState: function() {
            return {
                script: new ScriptModel(),
                editor: undefined
            };
        },

        componentWillMount: function() {
            this._ofp_state = State.find_by_name("Furby");
        },

        componentDidMount: function() {
            var editor = ace.edit("editor");
            editor.getSession().setMode("ace/mode/python");
            this.setState({ editor: editor });
            this._ofp_state.on('change:script_name', this._update, this);
            $(window).on('resize', this._resize);
            this._resize();
        },

        componentWillUnmount: function() {
            this._ofp_state.off(null, null, this);
            $(window).off('resize');
        },

        render: function() {
            var name, body, words, priority;
            var s = this.state.script;
            var header_text = 'New file'
            var is_new = _.isUndefined(this._ofp_state.get('script_name'));

            if (s && s.get('name')) {
                name = s.get('name');
                words = s.get('words');
                priority = s.get('priority');
                body = s.get('body')
                header_text = 'Editing: ' + name;
            }

            var name_input = (
                <div className="form-group row-fluid">
                    <label for="name" className="control-label">Script Name</label>
                    <input disabled={!!name} key={ _.uniqueId('script-name') } name="name" className="form-control" type="text" placeholder="Enter script name" defaultValue={name} /> </div>
            );
            var words_input = (
                <div className="form-group row-fluid">
                    <label for="words" className="control-label">Words</label>
                    <input key={ _.uniqueId('script-words') } name="words" className="form-control" type="text" placeholder="Enter words" defaultValue={words} />
                </div>
            );
            var priority_input = (
                <div className="form-group row-fluid">
                    <label for="words" className="control-label">Priority</label>
                    <input key={ _.uniqueId('script-priority') } name="priority" className="form-control" type="number" placeholder="Enter priority" defaultValue={priority} />
                </div>
            );

            var delete_button = is_new ? undefined : (
                <button className="btn btn-danger" onClick={this._delete}>
                    <i className="fa fa-trash" />
                </button>
            );

            return (
                <div className="editor-widget">
                    <div className="row-fluid">
                        <h3>{header_text}</h3>
                    </div>
                    <form className="options row-fluid" ref="form">
                        <div className="row-fluid">
                            <div className="col-md-8">
                                { name_input }
                            </div>
                            <div className="col-md-4">
                                { priority_input }
                            </div>
                        </div>
                        <div className="row-fluid">
                            <div className="col-md-8">
                                { words_input }
                            </div>
                            <div className="col-md-4 buttons">
                                <button className="btn btn-default" onClick={this._save}>
                                    <i className="fa fa-save" />
                                </button>
                                {delete_button}
                            </div>
                        </div>
                    </form>
                    <div className="row-fluid" id="editor" ref="editor">
                    </div>
                </div>
            );
        },

        _update: function() {
            if (!this.isMounted()) { return; }
            var selected = this._ofp_state.get('script_name');
            var model = this.props.collection.get(selected);
            if (model) {
                this.state.editor.setValue(model.get('body'));
            } else {
                this.state.editor.setValue('');
                model = new ScriptModel();
            }
            this.state.editor.gotoLine(1);
            this.setState({ script: model });
        },

        _save: function(e) {
            e.preventDefault();
            var script = {};
            var fields = _.each($(this.refs.form.getDOMNode()).serializeArray(), function(f) {
                script[f.name] = f.value;
            });
            script.body = this.state.editor.getValue();
            script.created = +new Date();
            script.priority = script.priority || 1;
            script.name = script.name || (this.state.script && this.state.script.get('name'));
            script.id = script.name;

            if (!script.name) { alert('cannot submit without a name'); return;  }
            var is_new = !this.state.script || !this.state.script.id;
            $.ajax({
                url: 'script/'+ script.name,
                type: (is_new ? 'POST' : 'PUT'),
                data: script,
                success: _.bind(function() {
                    this.props.collection.add(script);
                    this.props.collection.fetch();
                    this._ofp_state.set('script_name', script.name);
                    this._ofp_state.set('notification', { msg: 'Successfully saved: ' + script.name, type: 'success' });
                    this.forceUpdate();
                }, this)
            });
            return false;
        },

        _delete: function(e) {
            var name = this.state.script.get('name');
            e.preventDefault();
            $.ajax({
                url: 'script/'+this.state.script.id,
                type: 'DELETE',
                success: _.bind(function() {
                    this.props.collection.fetch();
                    this.state.editor.setValue('');
                    this.state.editor.gotoLine(1);
                    this._ofp_state.set('script_name', undefined);
                    this._ofp_state.set('notification', {
                        msg: 'Successfully deleted: ' + name,
                        type: 'success'
                    });
                }, this)
            });
            return false;
        },

        _resize: function() {
            $('#editor').height($(window).height() - 278);
        }

    });

    return EditorWidget;
});
