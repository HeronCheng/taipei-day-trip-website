from flask import Blueprint,request,jsonify
from flask_cors import CORS
from cnxpool import cnxpool
import requests
import jwt

Status=Blueprint("Status",__name__)

CORS(Status)

#註冊
@Status.route("/api/user",methods=["POST"])
def signup():
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    signup_username= request.form.get('signup_username')
    signup_email=request.form.get('signup_email')
    signup_password=request.form.get('signup_password')

    cursor.execute("SELECT `email` from `tripmember` WHERE `email`='"+signup_email+"';")
    checkregisterData=cursor.fetchall()

    prestatuscode=requests.get("http://18.180.51.21:3000/api/user")
    statuscode=prestatuscode.status_code
    prestatuscode.close()
    if checkregisterData != []:
        cursor.close()
        cnx.close()
        return jsonify({
            "error": True,
            "message": "註冊失敗，Email已存在。"
            }),400
    elif signup_username=="" or signup_email=="" or signup_password=="":
        cursor.close()
        cnx.close()
        return jsonify({
            "error": True,
            "message": "欄位不可空白"
            }),400
    elif checkregisterData == []:
        cursor.execute("INSERT INTO `tripmember` (`name`,`email`,`password`) VALUES ('"+signup_username+"','"+signup_email+"','"+signup_password+"');")
        cursor.close()
        cnx.commit()
        cnx.close()
        return jsonify({
            "ok": True
            }),200
    else:
        if statuscode == 500:
            cursor.close()
            cnx.close()
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                }),500

#登入
@Status.route("/api/user",methods=["PATCH"])
def signin():
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    signin_email=request.form.get('signin_email')
    signin_password=request.form.get('signin_password')
    cursor.execute("SELECT `id`,`name`,`email` from `tripmember` WHERE `email`='"+signin_email+"' and `password`='"+signin_password+"';")
    checksigninData=cursor.fetchall()
    cursor.close()
    cnx.close()
    prestatuscode=requests.get("http://18.180.51.21:3000/api/user")
    statuscode=prestatuscode.status_code
    prestatuscode.close()
    if signin_email == "" or signin_password == "":
        return jsonify({
            "error": True,
            "message": "欄位不可空白"
            }),400
    elif checksigninData == []:
        return jsonify({
            "error": True,
            "message": "帳號或密碼錯誤"
            }),400
    elif checksigninData != []:
        encoded_jwt = jwt.encode({"id":checksigninData[0][0],"name":checksigninData[0][1],"email": checksigninData[0][2]}, "mysecret", algorithm="HS256")
        jsonData=jsonify({"ok": True})
        jsonData.set_cookie(key='memberData', value=encoded_jwt, expires=None)
        return jsonData,200
    else:
        if statuscode == 500:
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                }),500
            
#確認使用者狀態
@Status.route("/api/user",methods=["GET"])
def status():
    encoded_jwt1=request.cookies.get('memberData')
    
    if encoded_jwt1==None:
        return jsonify({
        "data":None}),200
    else:
        decode_jwt=jwt.decode(encoded_jwt1, "mysecret", algorithms=["HS256"])
        return jsonify({
            "data": {
                "id": decode_jwt["id"],
                "name": decode_jwt["name"],
                "email": decode_jwt["email"]
            }
            }),200


#登出
@Status.route("/api/user",methods=["DELETE"])
def signout():
    signout_jsonData=jsonify({"ok": True})
    signout_jsonData.set_cookie(key='memberData', value='', expires=0)
    return signout_jsonData,200
