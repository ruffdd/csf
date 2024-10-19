import requests
import icalendar
import sqlite3 as sql
import os

DB_PATH='main.db'

def create_new_db():
    con:sql.Connection= sql.connect(DB_PATH)
    cur:sql.Cursor = con.cursor()
    cur.execute("CREATE Table IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT NOT NULL);")
    cur.execute("CREATE Table IF NOT EXISTS calendar_sources (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, name TEXT, userid INTEGER);")
    cur.execute("CREATE Table IF NOT EXISTS pipes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, source_id INTEGER, sink_id INTEGER);")
    try:
        user.create_user('test','123456')
    except:
        pass
    cur.execute("INSERT INTO pipes (user_id,name,source_id,sink_id) VALUES(0,'test',0,0)")
    con.commit()
    con.close()

# Table calendar_sources {
#   id integer [primary key]
#   path varchar
#   user_id integer
# }

# Table calendar_sinks{
#   id integer [primary key]
#   path varchar
#   user_id integer
# }

# Table pipe {
#   source_id integer [primary key]
#   user_id integer
#   filters text
#   sink_id integer
# }

# Ref: pipe.source_id > calendar_sources.id // many-to-one

# Ref: pipe.user_id > users.id

# Ref: calendar_sources.user_id > users.id
# Ref: calendar_sinks.user_id > users.id
# Ref: pipe.sink_id - calendar_sinks.id
   

class user:
    def __init__(self,id):
        self.con:sql.Connection= sql.connect(DB_PATH)
        cur:sql.Cursor = self.con.cursor()
        self.ID=id
        res=cur.execute("SELECT username FROM users WHERE id = ?",(id,))
        self.NAME = res.fetchone()[0]
    
    def create_user(name,password):
        con:sql.Connection= sql.connect(DB_PATH)
        cur:sql.Cursor = con.cursor()
        try:
            cur.execute("INSERT INTO users (username,password) VALUES(?,?)",(name,password))
        except Exception as e:
            raise e
        finally:
            con.commit()
            con.close()
    
    def add_calendar_source(self):
        pass

        
    def get_list_of_sources(self):
        cur:sql.Cursor = self.con.cursor()
        cur.execute("SELECT id,path,name FROM calendar_sources WHERE userid=?",(self.ID,))
        return cur.fetchall()
    
    def get_list_of_pipes(self):
        cur:sql.Cursor = con.cursor()
        res = cur.execute()
        
    def __del__(self):
        self.con.close()

def get_calendar(address):
    response = requests.get(address)
    if not response.ok:
        raise Exception("Address not found ("+str(response.status_code)+")")
    ics = response.content
    return icalendar.Calendar.from_ical(ics)


create_new_db()