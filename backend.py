import requests
import icalendar
import sqlite3 as sql
import os

DB_PATH='main.db'

def create_new_db():
    con:sql.Connection= sql.connect(DB_PATH)
    cur:sql.Cursor = con.cursor()
    cur.execute("CREATE Table IF NOT EXISTS users   (                 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, password TEXT NOT NULL);")
    cur.execute("CREATE Table IF NOT EXISTS sources (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT UNIQUE NOT NULL, path TEXT );")
    cur.execute("CREATE Table IF NOT EXISTS pipes   (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT UNIQUE NOT NULL, source_id INTEGER, sink_id INTEGER,filter TEXT);")
    cur.execute("CREATE Table IF NOT EXISTS sinks   (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT UNIQUE NOT NULL);")
    try:
        User.create_user('test','123456')
    except:
        pass
    try:
        cur.execute("INSERT INTO pipes (user_id,name,source_id,sink_id) VALUES(0,'test',0,0)")
    except:
        pass
    con.commit()
    con.close()

# Table sources {
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

# Ref: pipe.source_id > sources.id // many-to-one

# Ref: pipe.user_id > users.id

# Ref: sources.user_id > users.id
# Ref: calendar_sinks.user_id > users.id
# Ref: pipe.sink_id - calendar_sinks.id
   

class User:
    def __init__(self,id):
        self.con:sql.Connection= sql.connect(DB_PATH)
        cur:sql.Cursor = self.con.cursor()
        self.ID=id
        res=cur.execute("SELECT name FROM users WHERE id = ?",(id,))
        self.NAME = res.fetchone()[0]
    
    def create_user(name,password):
        con:sql.Connection= sql.connect(DB_PATH)
        cur:sql.Cursor = con.cursor()
        try:
            cur.execute("INSERT INTO users (name,password) VALUES(?,?)",(name,password))
        except Exception as e:
            raise e
        finally:
            con.commit()
            con.close()
    
    def source_add(self,path,name):
        cur:sql.Cursor = self.con.cursor()
        cur.execute("INSERT INTO sources (user_id,path,name) VALUES(?,?,?)",(self.ID,path,name))
        self.con.commit()
        
    def source_get_all(self):
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory= dict_factory
        cur.execute("SELECT id,name,path FROM sources WHERE user_id=?",(self.ID,))
        return cur.fetchall()
    
    def source_get(self,name):
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory= dict_factory
        cur.execute("SELECT id,name,path FROM sources WHERE user_id=? AND name=?",(self.ID,name))
        return cur.fetchone()
        
    def pipes_add(self,source_id:int,sink_id:int,name:str):
        cur:sql.Cursor = self.con.cursor()
        cur.execute("INSERT INTO pipes (user_id,name,source_id,sink_id) VALUES(?,?,?,?)",(self.ID,name,source_id,sink_id))
        self.con.commit()        
    
    def pipes_get_all_by_source(self,source_id:int):
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory=dict_factory
        cur.execute("SELECT id,name,sink_id,filter FROM pipes WHERE user_id=? AND source_id=?",(self.ID,source_id))
        return cur.fetchall()
        
    def sink_add(self,name:str):
        cur:sql.Cursor = self.con.cursor()
        cur.execute("INSERT INTO sinks (user_id,name) VALUES(?,?)",(self.ID,name))
        self.con.commit()

    
    def __del__(self):
        self.con.close()

# checks in table if a value with equal values exists.
def exists(conection:sql.Connection,table,values):
    params=(table,)
    command="SELECT * FROM ? WHERE"
    for k,v in values:
        command+=' ?=?'
        params+=(k,v)
    command+=';'
    cur=conection.cursor()
    cur.execute(command)
    return cur.fetchone() is not None
    

def get_calendar(address):
    response = requests.get(address)
    if not response.ok:
        raise Exception("Address not found ("+str(response.status_code)+")")
    ics = response.content
    return icalendar.Calendar.from_ical(ics)

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

create_new_db()

