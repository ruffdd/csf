from flask import Flask,request,render_template,Response,url_for,logging,jsonify,send_from_directory
import werkzeug.exceptions
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
    user =backend.user(1)
    return render_template('userpage.html',username=user.NAME,create_calendar_path=url_for('add_source',_method='POST'))
    

@app.route("/editpipe/<pipeid>")
def edit_pipe(pipeid):
    return render_template('pipeedit.html',pipeid=pipeid)

@app.route('/cmd/source',methods=['GET'])
def get_sources():
    user = backend.user(1)
    return jsonify(user.source_get_all())

@app.route('/cmd/source/add',methods=['POST'])
def add_source():
    user = backend.user(1)
    name=request.args['name']
    path=request.args['path']
    if user.source_get(name) is not None:
        return Response('a source with the name '+name+' already exists',status=400)
    try:
        user.source_add(path,name)
        return Response(status=201)
    except Exception as e:
        app.logger.error(str(e))
        return Response("Unknown Error",status=500)
    