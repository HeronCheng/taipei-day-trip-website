import mysql.connector
from mysql.connector import pooling

cnxpool=mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                        pool_size = 20,
                                                        pool_reset_session=True,
                                                        host='localhost',
                                                        port='3306',
                                                        user='root',
                                                        password='134679258',
                                                        database='website')