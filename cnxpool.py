import mysql.connector
from mysql.connector import pooling
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
cnxpool=mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                    pool_size = 20,
                                                    pool_reset_session=True,
                                                    host='localhost',
                                                    port='3306',
                                                    user='root',
                                                    password=os.environ.get('password'),                                            
                                                    database='website',
                                                    auth_plugin='mysql_native_password')
