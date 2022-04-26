import mysql.connector.pooling
import os
from dotenv import load_dotenv

load_dotenv()

password = os.getenv("password")

dbconfig={
    "host" : "localhost",
    "port" : "3306",
    "user" : "root",
    "password" : password,                                            
    "database" : "website",
    "auth_plugin" : "mysql_native_password"
}

cnxpool=mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "mypool",
    pool_size = 20,
    pool_reset_session = True,
    **dbconfig
)
