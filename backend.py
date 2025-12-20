import requests# type: ignore
import sqlite3 as sql
import os
import multiprocessing
import time
from ics import Calendar,Event#type: ignore
from requests import request
from time import sleep
import settings
import filter
from typing import Any
from pathlib import Path
import json

def create_new_db()->None:
    os.makedirs(settings.DATA_PATH,exist_ok=True)
    con:sql.Connection= sql.connect(settings.DB_PATH)
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
        self.con:sql.Connection= sql.connect(settings.DB_PATH)
        cur:sql.Cursor = self.con.cursor()
        self.ID=id
        res=cur.execute("SELECT name FROM users WHERE id = ?",(id,))
        self.NAME = res.fetchone()[0]
        self.store_path=settings.DATA_PATH/'user-data'/self.NAME
        os.makedirs(self.store_path,exist_ok=True)
    
    @staticmethod
    def create_user(name:str,password:str)->None:
        con:sql.Connection= sql.connect(settings.DB_PATH)
        cur:sql.Cursor = con.cursor()
        try:
            cur.execute("INSERT INTO users (name,password) VALUES(?,?)",(name,password))
        except Exception as e:
            raise e
        finally:
            con.commit()
            con.close()
    
    def store_filter(self,data:str,filter_name:str='default')->None:
        open(self.store_path/(filter_name+'.json'),'w').write(data)

    def get_nodes(self)->str:
        return ""
    
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
    
    def __init__(self,db_path:Path)->None:
        super().__init__()
        self.DB_PATH=db_path
        
    def run(self)->None:
        self.connection:sql.Connection = sql.connect(self.DB_PATH)
        # while(True):
        #     for user_id in self.user_id_getAll():
        #         user = User(user_id)
        #         for source in user.source_get_all():
        #             ics=user.source_get_content(source['name'])
        #             for pipe in user.pipes_get_all_by_source(source['id']):
        #                 if pipe.get('source_id',None)==None:
        #                     print("pipe {} does not have a sink".format(pipe['name']))
        #                     continue
        #                 target=""
        #                 for calendar in Calendar.parse_multiple(ics):
        #                     current_target=Calendar()
        #                     for event in calendar.events:
        #                         if filter.event(event):
        #                             current_target.events.add(event)
        #                     target+=(current_target.serialize())
        #                 user.sink_set_content(pipe['sink_id'],target)
        #     sleep(20)
            
        
    def user_id_getAll(self)->list[int]:
        cursor:sql.Cursor=self.connection.cursor()
        cursor.execute("SELECT id FROM users")
        cursor.row_factory=single_factory
        return cursor.fetchall()

create_new_db()
Worker(settings.DB_PATH).start()
