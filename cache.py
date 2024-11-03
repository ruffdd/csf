import uuid
import os
from config import CACHE_PATH

try:
    os.mkdir(CACHE_PATH,)
except FileExistsError:
    pass

def get(id:uuid.UUID):
    filepath=CACHE_PATH+"/"+str(id)
    if not os.path.exists(filepath):
        return None
    else:
        return open(filepath,'r').read()
    

def store(id=null):
    pass