from multiprocessing.dummy import Event
from flask import Blueprint, request,jsonify
from flask_cors import CORS
from cnxpool import cnxpool
import json,requests,jwt
from datetime import datetime
from ast import literal_eval

Order=Blueprint("Order",__name__)

CORS(Order)

#建立訂單編號的尾數數字
time=0
def ordernumber():
    global time
    data_time=datetime.now()
    preorder_number=datetime.strftime(data_time,'%Y%m%d%H%M')
    order_number1=preorder_number+str(time)
    time+=1
    return order_number1


#建立新訂單，並完成付款程序
@Order.route("/api/orders",methods=["POST"])
def orders():
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()
    
    data = json.loads(request.get_data())

    encoded_jwt1=request.cookies.get('memberData')
    decode_jwt=jwt.decode(encoded_jwt1, "mysecret", algorithms=["HS256"])
    #抓出使用者id
    user_id=decode_jwt["id"]

    partner_key=data["partner_key"]
    prime=data["prime"]
    merchant_id=data["merchant_id"]

    order_number=ordernumber()

    price=data["order"]["price"]
    name=data["order"]["contact"]["name"]
    email=data["order"]["contact"]["email"]
    phone=data["order"]["contact"]["phone"]

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
    
    #檢查是否登入
    encoded_jwt1=request.cookies.get('memberData')

    try:
        if encoded_jwt1 == None:
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
                cnx.commit()

            response=requests.post(url, headers=headers, data=json.dumps(pay_data))
            
            status=response.json()["status"]
            print(status)
            
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
                cursor.close()
                cnx.commit()
                cnx.close()
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
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
            }),500
    finally:
        cursor.close()
        cnx.commit()
        cnx.close()
    

#根據訂單編號取得訂單資訊
@Order.route("/api/order/<orderNumber>",methods=["GET"])
def order(orderNumber):
    #檢查登入與否
    encoded_jwt1=request.cookies.get('memberData')
    if encoded_jwt1 == None:
        return jsonify({
            "error": True,
            "message": "尚未登入"
            }),403
    else:
        cnx=cnxpool.get_connection()
        cursor=cnx.cursor()
        cursor.execute("SELECT * FROM `triporder` WHERE `order_number`="+orderNumber+";")
        result=cursor.fetchall()
        trip=literal_eval(result[0][2])[0]
        attraction=literal_eval(result[0][2])[0]["attraction"]
        cursor.close()
        cnx.close()
        return jsonify({
            "data": {
                "number": orderNumber,
                "total_price": result[0][3],
                "trip": literal_eval(result[0][2]),
                "contact": {
                "user_id":result[0][1],
                "name": result[0][4],
                "email": result[0][5],
                "phone": result[0][6]
                },
                "status": result[0][7]
            }
            }),200