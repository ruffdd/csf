from flask import Flask,request,render_template
import backend

app = Flask(__name__)

@app.route("/")
def startpage():
    return '<h1>CSF</h1><a href="userpage">Go</a>'

@app.route("/userpage")
def user_page():
    user =backend.user(1)
    return render_template('userpage.html',username=user.NAME,calendar_sources=user.get_list_of_sources())
    

@app.route("/editpipe/<pipeid>")
def edit_pipe(pipeid):
    return render_template('pipeedit.html',pipeid=pipeid)

@app.route('/part')

@app.route('/cmd/show-cal')
def show_calendar():
    cal=backend.get_calendar(
    request.args['addr'])
       
    return str(cal)
    