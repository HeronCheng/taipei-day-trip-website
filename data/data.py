import json,re
from ntpath import join
import mysql.connector

connection=mysql.connector.connect(
                                    host='localhost',
                                    port='3306',
                                    user='root',
                                    password='123456',
                                    database='website'
)
cursor=connection.cursor()
with open("taipei-attractions.json",mode="r",encoding="utf-8") as json_file:
    data=json.load(json_file)
list=data["result"]["results"]

for allData in list:
    name=allData["stitle"]
    category=allData["CAT2"]
    description=allData["xbody"]
    address=allData["address"].replace(' ','')
    transport=allData["info"]
    mrt=allData["MRT"]
    if mrt is None:
        mrt="無捷運站可到達"
    latitude=allData["latitude"]
    longitude=allData["longitude"]
    preImage=allData["file"].split("https://")
    preImage2 = ["https://"+x for x in preImage if re.search("JPG", x)]
    preImage3 = ["https://"+x for x in preImage if re.search("jpg", x)]
    images=",".join(preImage2+preImage3)
    cursor.execute("INSERT INTO `attraction`(`name`,`category`,`description`,`address`,`transport`,`mrt`,`latitude`,`longitude`,`images`) VALUES('"+name+"','"+category+"','"+description+"','"+address+"','"+transport+"','"+mrt+"','"+latitude+"','"+longitude+"','"+images+"');")
cursor.close() 
connection.commit()
connection.close()    
