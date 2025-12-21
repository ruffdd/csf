import os
from pathlib import Path
import os

def __value__(name:str,default:str)->str:
    try:
        return os.environ[name]
    except KeyError:
        return default


DATA_PATH=Path(__value__('DATA_PATH','data'))
DB_PATH=DATA_PATH/'main.db'
CACHE_PATH=os.path.abspath('.cache')
TEMPLATE_PATH=Path(__value__('TEMPLATE_PATH','templates'))
STATIC_PATH=Path(__value__('STATIC_PATH','static'))