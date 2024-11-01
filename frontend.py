from flask import Flask,request,render_template,Response,url_for,logging,jsonify,send_from_directory
from werkzeug.exceptions import BadRequestKeyError
import backend

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
    return '<h1>CSF</h1><a href="userpage">Go</a>'

@app.route("/userpage")
def user_page():
    user =backend.User(1)
    return render_template(
        'userpage.html',
        username=user.NAME,
        create_calendar_path=url_for('add_source',_method='POST'),
        create_pipe_path=url_for('add_pipe',_method='POST'))
    

@app.route("/editpipe/<pipeid>")
def edit_pipe(pipeid):
    return render_template('pipeedit.html',pipeid=pipeid)

@app.route('/cmd/source',methods=['GET'])
def get_sources():
    user = backend.User(1)
    return jsonify(user.source_get_all())


@app.route('/cmd/source/<string:name>/preview',methods=['GET'])
def get_source_content(name:str):
    user = backend.User(1)
    return user.source_get_content(name)

@app.route('/cmd/source/add',methods=['POST'])
def add_source():
    user = backend.User(1)
    name=request.form['nam']
    path=request.form['path']
    if user.source_get(name) is not None:
        return Response('a source with the name '+name+' already exists',status=400)
    try:
        user.source_add(path,name)
        return Response(status=201)
    except Exception as e:
        app.logger.error(str(e))
        return Response("Unknown Error",status=500)
    
@app.route('/cmd/pipe/add',methods=['POST'])
def add_pipe():
    user = backend.User(1)
    try:
        user.pipes_add(*get_form_data(request,['source_id','sink_id','nam']))
    except KeyError as e:
        return *e.args,400
    
    return "",201

@app.route('/cmd/pipe',methods=['GET'])
def get_pipes():
    user = backend.User(1)
    return jsonify(user.pipes_get_all_by_source(1))

@app.route('/cmd/sink/add',methods=['POST'])
def add_sink():
    user = backend.User(1)
    
    user.sink_add(request.form['name'])
    
    return "",201

def get_form_data(request,names)->list:
    output=list()
    for name in names:
        try:
            output.append(request.form[name])
        except BadRequestKeyError as e:
            raise KeyError('key "'+name+'" was not found in form data')
    return output