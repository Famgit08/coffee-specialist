import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    server = os.getenv("DB_SERVER", "db,1433")
    db_name = os.getenv("DB_NAME", "Coffee Specialist DB")
    db_user = os.getenv("DB_USER", "sa")
    db_password = os.getenv("DB_PASSWORD", "YourStrong!Passw0rd")
    
    conn_str = (
        f'DRIVER={{ODBC Driver 17 for SQL Server}};'
        f'SERVER={server};'
        f'DATABASE={db_name};'
        f'UID={db_user};'
        f'PWD={db_password};'
        f'TrustServerCertificate=yes;'
    )
        
    return pyodbc.connect(conn_str)