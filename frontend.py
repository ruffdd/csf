from flask import Flask,request,render_template,Response,url_for,logging,jsonify,send_from_directory
from werkzeug.exceptions import BadRequestKeyError
import backend
import json

app = Flask(__name__)

@app.errorhandler(404)
def missing_file(error):
    if request.base_url.endswith('.ico'):
        res= send_from_directory('static','missing.ico')
        app.logger.info('could not find '+request.url+' serving missing.ico instead')
        res.status_code=200
        return res
    else:
        return render_template('error.html',code=404),404

@app.route("/")
def startpage():
    return '<h1>CSF</h1><a href="user">Go</a>',200

@app.route("/user")
def user():
    return Response("",302,{"location":"/user/filter"})

@app.route("/user/filter")
def user_page():
    user =backend.User(1)
    return Response(render_template(
        'node-editor.html',
        username=user.NAME,
        create_calendar_path="",
        create_pipe_path=""),200)

@app.route("/user/filter/save",methods=['POST'])
def save():
    user=backend.User(1)
    data=""
    data=json.dumps(request.json)
    user.store_filter(data)
    return "",201

@app.route("/user/filter/load",methods=['GET'])
def load():
    user=backend.User(1)
    print(request.data)
    return "",201
    
@app.route("/user_config.json")
def user_nodes():
    user = backend.User(1)
    return user.get_nodes()

def get_form_data(request,names)->list:
    output=list()
    for name in names:
        try:
            output.append(request.form[name])
        except BadRequestKeyError as e:
            raise KeyError('key "'+name+'" was not found in form data')
    return output

# def arg_or_fail(request:Flask.request_class,name:str):
#     pass
    