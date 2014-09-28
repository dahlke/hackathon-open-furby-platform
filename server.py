from flask import Flask, render_template
from flask.ext import restful
from flask.ext.restful import reqparse
import redis

r = redis.StrictRedis(host='192.168.2.133', port=6379, db=0)
pubsub = r.pubsub()
pubsub.subscribe('changes')
# listen for carl's changes, if there is a dict, refresh the page

app = Flask(__name__)
api = restful.Api(app)

parser = reqparse.RequestParser()
parser.add_argument('name', type=str)
parser.add_argument('created', type=str)
parser.add_argument('body', type=str)
parser.add_argument('words', type=str)
parser.add_argument('priority', type=int)

@app.route("/")
def hello():
    return render_template('index.html')

class Scripts(restful.Resource):
    def get(self):
        script_ids = r.smembers('scripts')
        scripts = []
        for id in script_ids:
            s = r.hgetall(id)
            scripts.append(s)
        return scripts

class Script(restful.Resource):
    def post(self, name):
        args = parser.parse_args()
        r.sadd('scripts', args['name'])
        r.hmset(args['name'], args)
        r.publish('changes', args['name'])
        return True

    def put(self, name):
        args = parser.parse_args()
        r.hmset(args['name'], args)
        r.publish('changes', args['name'])
        return True

    def delete(self, name):
        r.srem('scripts', name)
        r.delete(name)
        return True

api.add_resource(Scripts, '/scripts')
api.add_resource(Script, '/script/<string:name>')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
