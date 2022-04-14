from flask import Blueprint,request,jsonify
from flask_cors import CORS
from cnxpool import cnxpool
import jwt

status=Blueprint("status",__name__)

CORS(status)

#註冊
@status.route("/api/user",methods=["POST"])
def signup():
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    signup_username= request.form.get('signup_username')
    signup_email=request.form.get('signup_email')
    signup_password=request.form.get('signup_password')

    cursor.execute("SELECT `email` from `tripmember` WHERE `email`='"+signup_email+"';")
    checkregisterData=cursor.fetchall()
    try:
        if checkregisterData != []:
            return jsonify({
                "error": True,
                "message": "註冊失敗，Email已存在。"
                }),400
        elif signup_username=="" or signup_email=="" or signup_password=="":
            return jsonify({
                "error": True,
                "message": "欄位不可空白"
                }),400
        elif checkregisterData == []:
            cursor.execute("INSERT INTO `tripmember` (`name`,`email`,`password`) VALUES ('"+signup_username+"','"+signup_email+"','"+signup_password+"');")
            return jsonify({
                "ok": True
                }),200
    except :
        cnx.rollback();
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
            }),500
    finally:
        cursor.close()
        cnx.commit()
        cnx.close()

#登入
@status.route("/api/user",methods=["PATCH"])
def signin():
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    signin_email=request.form.get('signin_email')
    signin_password=request.form.get('signin_password')
    cursor.execute("SELECT `id`,`name`,`email` from `tripmember` WHERE `email`='"+signin_email+"' and `password`='"+signin_password+"';")
    checksigninData=cursor.fetchall()
    cursor.close()
    cnx.close()
    try:
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
            encoded_jwt = jwt.encode({"id":checksigninData[0][0],"name":checksigninData[0][1],"email": checksigninData[0][2],"password":signin_password}, "mysecret", algorithm="HS256")
            jsonData=jsonify({"ok": True})
            jsonData.set_cookie(key='memberData', value=encoded_jwt, expires=None)
            return jsonData,200
    except:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
            }),500

            
#確認使用者狀態
@status.route("/api/user",methods=["GET"])
def getstatus():
    encoded_jwt=request.cookies.get('memberData')
    decode_jwt=jwt.decode(encoded_jwt, "mysecret", algorithms=["HS256"])
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    cursor.execute("SELECT `password` from `tripmember` WHERE `id`='"+str(decode_jwt["id"])+"';")
    userdata=cursor.fetchone()
    cursor.close()
    cnx.close()
    if encoded_jwt==None:
        return jsonify({
        "data":None}),200
    else:
        return jsonify({
            "data": {
                "id": decode_jwt["id"],
                "name": decode_jwt["name"],
                "email": decode_jwt["email"],
                "password":userdata[0]
            }
            }),200


#登出
@status.route("/api/user",methods=["DELETE"])
def signout():
    signout_jsonData=jsonify({"ok": True})
    signout_jsonData.set_cookie(key='memberData', value='', expires=0)
    return signout_jsonData,200

#修改使用者密碼
@status.route("/api/users",methods=["PATCH"])
def revise():
    try:
        cnx=cnxpool.get_connection()
        cursor=cnx.cursor()
        modify_password= request.form.get('modify_password')
        modify_password2=request.form.get('modify_password2')

        encoded_jwt=request.cookies.get('memberData')
        decode_jwt=jwt.decode(encoded_jwt, "mysecret", algorithms=["HS256"])
        user_id=decode_jwt["id"]

        if modify_password != modify_password2:
            return jsonify({
            "error": True,
            "message": "兩次新密碼輸入不一致"
            }),400
        else:
            cursor.execute("UPDATE `tripmember` SET `password`=%s WHERE `id`=%s;",(modify_password,user_id))
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