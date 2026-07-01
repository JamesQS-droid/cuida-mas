from dotenv import load_dotenv
import os

load_dotenv()

DB_SERVER   = os.getenv("DB_SERVER")
DB_DATABASE = os.getenv("DB_DATABASE")
DB_DRIVER   = os.getenv("DB_DRIVER")
JWT_SECRET  = os.getenv("JWT_SECRET")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 480))