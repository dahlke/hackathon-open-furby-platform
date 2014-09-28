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
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/python");
            this.setState({ editor: editor });
            this._ofp_state.on('change', this._update, this);
        },

        componentWillUnmount: function() {
            this._ofp_state.off(null, null, this);
        },

        render: function() {
            var name, body, words, priority;
            var s = this.state.script;

            if (s && s.get('name')) {
                name = s.get('name');
                words = s.get('words');
                priority = s.get('priority');
                body = s.get('body')
            }

            var name_input = (
                <div className="form-group row">
                    <label for="name" className="control-label">Script Name</label>
                    <input key={ _.uniqueId('script-name') } name="name" className="form-control" type="text" placeholder="Enter script name" defaultValue={name} />
                </div>
            );
            var words_input = (
                <div className="form-group row">
                    <label for="words" className="control-label">Words</label>
                    <input key={ _.uniqueId('script-words') } name="words" className="form-control" type="text" placeholder="Enter words" defaultValue={words} />
                </div>
            );
            var priority_input = (
                <div className="form-group row">
                    <label for="words" className="control-label">Priority</label>
                    <input key={ _.uniqueId('script-priority') } name="priority" className="form-control" type="number" placeholder="Enter priority" defaultValue={priority} />
                </div>
            );

            return (
                <div className="editor-widget">
                    <form className="options row-fluid" ref="form">
                        <div className="row">
                            <div className="col-md-8">
                                { name_input }
                            </div>
                            <div className="buttons col-md-4">
                                { priority_input }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8">
                                { words_input }
                            </div>
                            <div className="col-md-4">
                                <button className="btn btn-default" onClick={this._create}>
                                    <i className="fa fa-file-o" />
                                </button>
                                <button className="btn btn-default" onClick={this._save}>
                                    <i className="fa fa-save" />
                                </button>
                                <button className="btn btn-danger" onClick={this._delete}>
                                    <i className="fa fa-trash" />
                                </button>
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
                this.state.editor.gotoLine(1);
                this.setState({ script: model });
            }
        },

        _create: function(e) {
            e.preventDefault();
            this.setState({ script: new ScriptModel() });
            this._ofp_state.set('script_name', undefined);
            this.state.editor.setValue('');
            this.state.editor.gotoLine(1);
            return false;
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

            if (!script.name) { alert('cannot submit without a name'); }
            var is_new = !this.state.script.id;
            $.ajax({
                url: 'script/'+ (this.state.script.id || script.name),
                type: (is_new ? 'POST' : 'PUT'),
                data: script,
                success: _.bind(function() {
                    this.props.collection.fetch();
                    if (is_new) { this.state.script.id = script.name; }
                }, this)
            });
            return false;
        },

        _delete: function(e) {
            e.preventDefault();
            $.ajax({
                url: 'script/'+this.state.script.id,
                type: 'DELETE',
                success: _.bind(function() {
                    this.props.collection.fetch();
                    this.state.editor.setValue('');
                    this.state.editor.gotoLine(1);
                    this.setState({ script: new ScriptModel() });
                }, this)
            });
            return false;
        }

    });

    return EditorWidget;
});
