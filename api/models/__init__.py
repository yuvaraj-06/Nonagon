import os
from pathlib import Path
from dotenv import load_dotenv, find_dotenv

env_path = find_dotenv(".env")
load_dotenv(dotenv_path=env_path)

COVALENT_API_KEY = os.getenv("COVALENT_API_KEY")
###### LOAD FastAPI ENV Variables ######
PORT = int(os.getenv("PORT"))
HOST = os.getenv("HOST")
WORKER = int(os.getenv("WORKER"))
