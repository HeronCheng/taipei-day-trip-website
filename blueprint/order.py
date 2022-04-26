from flask import Blueprint, request,jsonify
from flask_cors import CORS
from cnxpool import cnxpool
import json,requests,jwt
from datetime import datetime
from ast import literal_eval
import os
from dotenv import load_dotenv

order=Blueprint("order",__name__)

# CORS(order)

load_dotenv()

#建立訂單編號
def makeordernumber(user_id):
    global time
    data_time=datetime.now()
    preorder_number=datetime.strftime(data_time,'%Y%m%d%H%M%S')
    order_number=preorder_number+str(user_id)
    return order_number


#建立新訂單，並完成付款程序
@order.route("/api/orders",methods=["POST"])
def buildorders():
    #檢查是否登入
    encoded_jwt=request.cookies.get('memberData')
    decode_jwt=jwt.decode(encoded_jwt, "mysecret", algorithms=["HS256"])
    data = json.loads(request.get_data())
    phone=data["order"]["contact"]["phone"]
    if encoded_jwt == None:
            return jsonify({
                "error": True,
                "message": "尚未登入"
                }),403
    elif phone == "":
        return jsonify({
            "error": True,
            "message": "未輸入手機號碼"
            }),400
    else:
        #抓出使用者id
        user_id=decode_jwt["id"]

        partner_key=os.getenv("partner_key")
        prime=data["prime"]
        merchant_id=os.getenv("merchant_id")

        order_number=makeordernumber(user_id)

        price=data["order"]["price"]
        name=data["order"]["contact"]["name"]
        email=data["order"]["contact"]["email"]
        

        attractions=data["order"]["trip"]
        

        #測試環境 URL
        url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"

        headers={
            "Content-Type": "application/json",
            "x-api-key": partner_key
        }

        #呼叫 TapPay 付款 API的資料
        pay_data={
        "prime": prime,
        "partner_key": partner_key,
        "merchant_id": merchant_id,
        "details":"TapPay Test",
        "amount": price,
        "order_number":order_number,
        "cardholder": {
            "phone_number": phone,
            "name": name,
            "email": email
        },
        "remember": True
        }
        

        try:
            cnx=cnxpool.get_connection()
            cursor=cnx.cursor()
            # 付款狀態:1是尚未付款，0是付款成功
            status=1
            
            #將訂單資料放入資料庫的訂單資料表，並刪除預定資料表中的資料
            comment = "INSERT INTO `triporder`(`order_number`,`user_id`,`attractions`,`totalprice`,`name`,`email`,`phone`,`status`) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
            values=(order_number,user_id,str(attractions),price,name,email,phone,status)
            cursor.execute(comment,values)

            bookingdata=[]
            for i in attractions:
                booking=i["bookingnumber"]
                bookingdata.append(booking)
            for i in bookingdata:
                cursor.execute("DELETE FROM `bookingdata` WHERE `booking_number`='"+str(i)+"';")

            response=requests.post(url, headers=headers, data=json.dumps(pay_data))
            
            status=response.json()["status"]
            
            if (response.json()["msg"])=='Success':
                cursor.execute("UPDATE `triporder` SET `status`=0 WHERE `order_number`="+order_number+";")
                return jsonify({
                    "data": {
                        "number": order_number,
                        "payment": {
                        "status":0 ,
                        "message": "付款成功"
                        }
                    }
                    }),200
            else:
                return jsonify({
                    "data": {
                        "number": order_number,
                        "payment": {
                        "status":1 ,
                        "message": "付款失敗"
                        }
                    }
                    }),200
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
    
#查詢使用者所有訂單
@order.route("/api/orders",methods=["GET"])
def getorders():
    try:
        #檢查登入與否
        encoded_jwt=request.cookies.get('memberData')
        decode_jwt=jwt.decode(encoded_jwt, "mysecret", algorithms=["HS256"])
        if encoded_jwt == None:
            return jsonify({
                "error": True,
                "message": "尚未登入"
                }),403
        else:
            user_id=decode_jwt["id"]
            cnx=cnxpool.get_connection()
            cursor=cnx.cursor()
            cursor.execute("SELECT * FROM `triporder` WHERE `user_id`='"+str(user_id)+"' ORDER BY `order_number` DESC;")
            result=cursor.fetchall()
            cursor.close()
            cnx.close()
            list=[]
            for i in range(len(result)):
                prelist={
                    "number": result[i][0],
                    "total_price": result[i][3],
                    "trip": literal_eval(result[i][2]),
                    "status": result[i][7]
                }
                list.append(prelist)
            return jsonify({"data":list}),200
    except:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
            }),500


#根據訂單編號取得訂單資訊
@order.route("/api/order/<orderNumber>",methods=["GET"])
def showorder(orderNumber):
    try:
        #檢查登入與否
        encoded_jwt=request.cookies.get('memberData')
        if encoded_jwt == None:
            return jsonify({
                "error": True,
                "message": "尚未登入"
                }),403
        else:
            cnx=cnxpool.get_connection()
            cursor=cnx.cursor()
            cursor.execute("SELECT * FROM `triporder` WHERE `order_number`="+orderNumber+";")
            result=cursor.fetchone()
            cursor.close()
            cnx.close()
            return jsonify({
                "data": {
                    "number": orderNumber,
                    "total_price": result[3],
                    "trip": literal_eval(result[2]),
                    "contact": {
                    "user_id":result[1],
                    "name": result[4],
                    "email": result[5],
                    "phone": result[6]
                    },
                }
                }),200
    except:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
            }),500