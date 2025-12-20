import os
from pathlib import Path

DATA_PATH=Path('data')
DB_PATH=DATA_PATH/'main.db'
CACHE_PATH=os.path.abspath('.cache')