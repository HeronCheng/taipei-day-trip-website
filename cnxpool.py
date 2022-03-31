import mysql.connector.pooling

dbconfig={
    "host" : "localhost",
    "port" : "3306",
    "user" : "root",
    "password" : "123456",                                            
    "database" : "website",
    "auth_plugin" : "mysql_native_password"
}

cnxpool=mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "mypool",
    pool_size = 20,
    pool_reset_session = True,
    **dbconfig
)
