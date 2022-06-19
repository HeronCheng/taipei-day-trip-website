from flask import Blueprint,jsonify,request
from flask_cors import CORS
from cnxpool import cnxpool
import jwt

booking=Blueprint("booking",__name__)


#取得尚未確認下單的預定行程
@booking.route("/api/booking",methods=["GET"])
def check():
    
    encoded_jwt1=request.cookies.get('memberData')
    decode_jwt=jwt.decode(encoded_jwt1, "mysecret", algorithms=["HS256"])
    #抓出使用者id
    user_id=decode_jwt["id"]

    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    #查詢使用者有幾筆訂單
    cursor.execute("SELECT count(*) FROM `bookingdata` WHERE `user_id`="+str(user_id)+";")
    premanybooking=cursor.fetchone()
    manybooking=premanybooking[0]
    try:
        if encoded_jwt1 == None:
            return jsonify({
                "error": True,
                "message": "尚未登入"
                }),403
        elif manybooking==0:
            return jsonify({
            "data":None}),200
        else:
            cursor.execute("SELECT `booking_number`,`attraction_id`,`attraction_name`,`attraction_address`,`attraction_image`,`bookdate`,`booktime`,`price` FROM `bookingdata` WHERE `user_id`="+str(user_id)+";")
            result=cursor.fetchall()
            
            list=[]
            i=0
            while i<manybooking:
                prelist= {
                    "bookingnumber":int(result[i][0]),
                    "attraction": {
                    "id": int(result[i][1]),
                    "name": result[i][2],
                    "address": result[i][3],
                    "image": result[i][4]
                    },
                    "date": result[i][5],
                    "time": result[i][6],
                    "price": result[i][7]
                }
                i+=1
                list.append(prelist.copy())   
            return jsonify({"count":manybooking,"data":list}),200
    finally:
        cursor.close()
        cnx.close()

#建立新的預定行程
@booking.route("/api/booking",methods=["POST"])
def build():
    cnx=cnxpool.get_connection()
    cursor = cnx.cursor()

    attractionid= request.form.get('id')
    date=request.form.get('date')
    time=request.form.get('time')
    fee=request.form.get('fee')

    encoded_jwt1=request.cookies.get('memberData')
    decode_jwt=jwt.decode(encoded_jwt1, "mysecret", algorithms=["HS256"])
    user_id=decode_jwt["id"]
    user_name=decode_jwt["name"]
    user_email=decode_jwt["email"]
    #設定最多預定五筆訂單，所以在這裡檢查目前有幾筆
    cursor.execute("SELECT count(*) FROM `bookingdata` WHERE `user_id`="+str(user_id)+";")
    result=cursor.fetchone()
    try:
        if encoded_jwt1 == None:
            return jsonify({
                "error": True,
                "message": "尚未登入"
                }),403
        elif result[0]>=5:
            return jsonify({
                "error": True,
                "message": "建立失敗"
                }),400
        else:
            cursor.execute("SELECT `name`,`address`,`images` FROM `attraction` WHERE `id`="+attractionid+";")
            attraction_data=cursor.fetchone()
            attraction_image=attraction_data[2].split(",")
            command = 'INSERT INTO `bookingdata`(`user_id`,`name`,`email`,`attraction_id`,`attraction_name`,`attraction_address`,`attraction_image`,`bookdate`,`booktime`,`price`) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s); '
            values=(user_id,user_name,user_email,attractionid,attraction_data[0],attraction_data[1],attraction_image[0],date,time,fee)
            cursor.execute(command,values)
            #取得剛剛插入的預定編號
            
            return jsonify({"ok": True}),200
    except:
        cnx.rollback()
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
            }),500
    finally:
        cursor.close()
        cnx.commit()
        cnx.close()


#刪除目前的預定行程
@booking.route("/api/booking",methods=["DELETE"])
def delete():
    encoded_jwt1=request.cookies.get('memberData')
    decode_jwt=jwt.decode(encoded_jwt1, "mysecret", algorithms=["HS256"])
    user_id=decode_jwt["id"]
    try:
        if encoded_jwt1 == None:
            return jsonify({
                "error": True,
                "message": "尚未登入"
                }),403
        else:
            cnx=cnxpool.get_connection()
            cursor=cnx.cursor()
            booking_number= request.form.get('booking_number')
            cursor.execute("DELETE FROM `bookingdata` WHERE `booking_number`='"+booking_number+"';")
            cursor.execute("SELECT count(*) FROM `bookingdata` WHERE `user_id`="+str(user_id)+";")
            result=cursor.fetchone()
            return jsonify({"ok": True,"booknumber":result[0]}),200
    except:
        cnx.rollback()
    finally:
        cursor.close()
        cnx.commit()
        cnx.close()