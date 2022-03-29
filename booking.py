from flask import Blueprint,jsonify,request
from flask_cors import CORS
from cnxpool import cnxpool
import requests,json

Booking=Blueprint("Booking",__name__)

CORS(Booking)

#取得尚未確認下單的預定行程
@Booking.route("/api/booking",methods=["GET"])
def check():
    
    encoded_jwt1=request.cookies.get('memberData')
    prebookingdata=request.cookies.get('bookingdata')
    
    if encoded_jwt1 == None:
        return jsonify({
            "error": True,
            "message": "尚未登入"
            }),403
    elif prebookingdata==None:
        return jsonify({
        "data":None}),200
    else:
        cnx=cnxpool.get_connection()
        cursor=cnx.cursor()
        bookingdata=json.loads(prebookingdata)
        cursor.execute("SELECT `name`,`address`,`images` FROM `attraction` WHERE `id`="+bookingdata[0]+";")
        result=cursor.fetchall()
        cursor.close()
        cnx.close()
        preImages=result[0][2]
        images=preImages.split(",")
        return jsonify({
        "data": {
            "attraction": {
            "id": bookingdata[0],
            "name": result[0][0],
            "address": result[0][1],
            "image": images[0]
            },
            "date": bookingdata[1],
            "time": bookingdata[2],
            "price": bookingdata[3]
        }
        }),200


#建立新的預定行程
@Booking.route("/api/booking",methods=["POST"])
def build():
    attractionid= request.form.get('id')
    date=request.form.get('date')
    time=request.form.get('time')
    fee=request.form.get('fee')
    precookiePayload = [attractionid,date,time,fee]
    cookiePayload=json.dumps(precookiePayload)

    requests.adapters.DEFAULT_RETRIES = 5 # 增加重連次數
    s = requests.session()
    s.keep_alive = False # 關閉多餘連線
    prestatuscode=s.get("http://18.180.51.21:3000/api/booking")
    statuscode=prestatuscode.status_code
    prestatuscode.close()
    encoded_jwt1=request.cookies.get('memberData')
    if encoded_jwt1 == None:
        return jsonify({
            "error": True,
            "message": "尚未登入"
            }),403
    elif attractionid !="" and date !="" and time !="" and fee !="":
        jsonData=jsonify({"ok": True})
        jsonData.set_cookie(key='bookingdata', value=cookiePayload, expires=None)
        return jsonData,200
    elif date == "":
        return jsonify({
            "error": True,
            "message": "建立失敗"
            }),400
    else:
        if statuscode == 500:
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                }),500


#刪除目前的預定行程
@Booking.route("/api/booking",methods=["DELETE"])
def delete():
    encoded_jwt1=request.cookies.get('memberData')
    if encoded_jwt1 == None:
        return jsonify({
            "error": True,
            "message": "尚未登入"
            }),403
    else:
        delete_jsonData=jsonify({"ok": True})
        delete_jsonData.set_cookie(key='bookingdata', value='', expires=0)
        return delete_jsonData,200