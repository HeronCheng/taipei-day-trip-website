from flask import Blueprint,jsonify,current_app
from flask_cors import CORS
from cnxpool import cnxpool
import re

attraction=Blueprint("attraction",__name__)

#根據景點編號取得景點資料
@attraction.route("/api/attraction/<attractionId>",methods=["GET"])
def getattraction(attractionId):
    current_app.config['JSON_SORT_KEYS'] = False
    if re.findall('[\d]',attractionId)!=[]:
        if int(attractionId)>58:
            return jsonify({
                "error":True,
                "message":"400 景點編號不正確"
            }),400
        else:
            cnx=cnxpool.get_connection()
            cursor=cnx.cursor()
            cursor.execute("SELECT * FROM `attraction` WHERE `id`="+attractionId+";")
            result=cursor.fetchall()
            cursor.close()
            cnx.close()
            id=int(result[0][0])
            name=result[0][1]
            category=result[0][2]
            description=result[0][3]
            address=result[0][4]
            transport=result[0][5]
            mrt=result[0][6]
            latitude=float(result[0][7])
            longitude=float(result[0][8])
            preImages=result[0][9]
            images=preImages.split(",")
            list={
                    "id": id,
                    "name": name,
                    "category": category,
                    "description": description,
                    "address": address,
                    "transport": transport,
                    "mrt": mrt,
                    "latitude": latitude,
                    "longitude": longitude,
                    "images": images
                    }
            text={
                "data": list
                }
            response=jsonify(text)    
            return(response)
    else:
        return jsonify({
                "error":True,
                "message":"500 伺服器內部錯誤"
            }),500
