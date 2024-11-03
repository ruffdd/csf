import requests# type: ignore
import sqlite3 as sql
import os
import multiprocessing
import time
from ics import Calendar,Event#type: ignore
from requests import request
from time import sleep
from settings import DB_PATH
import filter
from typing import Any

def create_new_db()->None:
    con:sql.Connection= sql.connect(DB_PATH)
    cur:sql.Cursor = con.cursor()
    cur.execute("CREATE Table IF NOT EXISTS users   (                                           id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, password TEXT NOT NULL);")
    cur.execute("CREATE Table IF NOT EXISTS sources (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT UNIQUE NOT NULL, path TEXT, last_content TEXT);")
    cur.execute("CREATE Table IF NOT EXISTS pipes   (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT UNIQUE NOT NULL, source_id INTEGER NOT NULL, sink_id INTEGER,filter TEXT);")
    cur.execute("CREATE Table IF NOT EXISTS sinks   (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT UNIQUE NOT NULL, last_content TEXT);")
    try:
        User.create_user('test','123456')
    except:
        pass
    con.commit()
    con.close()

   

class User:
    def __init__(self,id:int)->None:
        self.con:sql.Connection= sql.connect(DB_PATH)
        cur:sql.Cursor = self.con.cursor()
        self.ID=id
        res=cur.execute("SELECT name FROM users WHERE id = ?",(id,))
        self.NAME = res.fetchone()[0]
    
    @staticmethod
    def create_user(name:str,password:str)->None:
        con:sql.Connection= sql.connect(DB_PATH)
        cur:sql.Cursor = con.cursor()
        try:
            cur.execute("INSERT INTO users (name,password) VALUES(?,?)",(name,password))
        except Exception as e:
            raise e
        finally:
            con.commit()
            con.close()
    
    def source_add(self,path:str,name:str)->None:
        cur:sql.Cursor = self.con.cursor()
        cur.execute("INSERT INTO sources (user_id,path,name) VALUES(?,?,?)",(self.ID,path,name))
        self.con.commit()
        
    def source_get_all(self)->list[dict[str,Any]]:
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory= dict_factory
        cur.execute("SELECT id,name,path FROM sources WHERE user_id=?",(self.ID,))
        return cur.fetchall()
    
    def source_get(self,name:str)->dict:
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory= dict_factory
        cur.execute("SELECT id,name,path FROM sources WHERE user_id=? AND name=?",(self.ID,name))
        return cur.fetchall()[0]
    
    def source_get_content(self,name:str)->str:
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory= single_factory
        cur.execute("SELECT path FROM sources WHERE user_id=? AND name=?",(self.ID,name))
        path=cur.fetchone()
        cur.execute("SELECT last_content FROM sources WHERE user_id=? AND name=?",(self.ID,name))
        last=cur.fetchone()
        return request('GET',path).content.decode('utf8')
        
    def pipes_add(self,source_id:int,name:str)->None:
        cur:sql.Cursor = self.con.cursor()
        cur.execute("INSERT INTO pipes (user_id,name,source_id) VALUES(?,?,?)",(self.ID,name,source_id))
        self.con.commit()        
    
    def pipes_get_all_by_source(self,source_id:int)->list[dict]:
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory=dict_factory
        cur.execute("SELECT id,name,sink_id,filter FROM pipes WHERE user_id=? AND source_id=?",(self.ID,source_id))
        return cur.fetchall()
    
    
    def sink_get_of_pipe(self,name:str)->dict:
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory=dict_factory
        cur.execute("SELECT sinks.name FROM sinks INNER JOIN pipes ON pipes.sink_id=sinks.id WHERE sinks.user_id=? AND pipes.user_id=? AND pipes.name=?;",(self.ID,self.ID,name))
        return cur.fetchall()[0]
        
    def sink_add(self,name:str,pipe_id:int)->None:
        cur:sql.Cursor = self.con.cursor()
        if not exists(self.con,'pipes',{'id':pipe_id}):
            raise Exception("the pipe with id: "+str(pipe_id)+" does not exist")
        cur.execute("INSERT INTO sinks (user_id,name) VALUES(?,?)",(self.ID,name))
        self.con.commit()
        cur.execute("SELECT id FROM sinks WHERE name=?",(name,))
        sink_id=cur.fetchone()[0]
        cur.execute("UPDATE pipes SET sink_id=? WHERE user_id=? AND id=?",(sink_id,self.ID,pipe_id))
        self.con.commit()

        
    def sink_set_content(self,id:int,content:str)->None:
        cur:sql.Cursor = self.con.cursor()
        cur.execute("UPDATE sinks SET last_content=? WHERE user_id=? AND id=?",(content,self.ID,id))
        self.con.commit()        
        
    def sink_get_content(self,name:str)->None:
        cur:sql.Cursor = self.con.cursor()
        cur.row_factory= single_factory
        cur.execute("SELECT last_content FROM sinks WHERE user_id=? AND name=?",(self.ID,name))
        path=cur.fetchone()
        
    
    def __del__(self)->None:
        self.con.close()

# checks in table if a value with equal values exists.
def exists(connection:sql.Connection,table:str,values:dict[str,Any])->bool:
    params:list[str]=list()
    if table not in get_tables(connection):
        raise Exception(f"{table} is not an existing table name. Possible sql injection?")
    command=f"SELECT * FROM {table} WHERE"
    for k,v in values.items():
        command+=' ?=? AND'
        params.append(k)
        params.append(v)
    command=command[:-4]
    command+=';'
    cur=connection.cursor()
    cur.execute(command,params)
    return cur.fetchone() is not None
    
def get_tables(connection:sql.Connection)->list:
    cur=connection.cursor()
    cur.row_factory=single_factory
    cur.execute("SELECT name FROM sqlite_schema WHERE name NOT LIKE 'sqlite%';")
    return cur.fetchall()

def dict_factory(cursor:sql.Cursor, row:sql.Row)->object:
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

def single_factory(cursor:sql.Cursor,row:sql.Row)->object:
    assert(len(cursor.description)==1)
    return row[0]


class Worker(multiprocessing.Process):
    connection:sql.Connection
    
    def __init__(self,db_path:str)->None:
        super().__init__()
        self.DB_PATH=db_path
        
    def run(self)->None:
        self.connection:sql.Connection = sql.connect(self.DB_PATH)
        while(True):
            for user_id in self.user_id_getAll():
                user = User(user_id)
                for source in user.source_get_all():
                    ics=user.source_get_content(source['name'])
                    for pipe in user.pipes_get_all_by_source(source['id']):
                        if pipe.get('source_id',None)==None:
                            print("pipe {} does not have a sink".format(pipe['name']))
                            continue
                        target=""
                        for calendar in Calendar.parse_multiple(ics):
                            current_target=Calendar()
                            for event in calendar.events:
                                if filter.event(event):
                                    current_target.events.add(event)
                            target+=(current_target.serialize())
                        user.sink_set_content(pipe['sink_id'],target)
            sleep(20)
            
        
    def user_id_getAll(self)->list[int]:
        cursor:sql.Cursor=self.connection.cursor()
        cursor.execute("SELECT id FROM users")
        cursor.row_factory=single_factory
        return cursor.fetchall()

create_new_db()
Worker(DB_PATH).start()
