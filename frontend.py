from flask import Flask,request,render_template,Response,url_for,logging
import werkzeug.exceptions
import backend

app = Flask(__name__)



@app.route("/")
def startpage():
    return '<h1>CSF</h1><a href="userpage">Go</a>'

@app.route("/userpage")
def user_page():
    user =backend.user(1)
    return render_template('userpage.html',username=user.NAME,calendar_sources=user.get_list_of_sources(),create_calendar_path=url_for('add_source',_method='POST'))
    

@app.route("/editpipe/<pipeid>")
def edit_pipe(pipeid):
    return render_template('pipeedit.html',pipeid=pipeid)


@app.route('/cmd/add-source',methods=['POST'])
def add_source():
    user = backend.user(1)
    ref=request.referrer
    try:
        user.add_calendar_source(request.form['path'],request.form['name'])
        return Response('<meta http-equiv="Refresh" content="0; URL='+ref+'"/>"',status=201)
    except werkzeug.exceptions.BadRequest as e:
        app.logger.warning(str(e))
        return Response(str(e),status=400)      
    except Exception as e:
        app.logger.error(str(e))
        return Response("Unknown Error",status=500)
    