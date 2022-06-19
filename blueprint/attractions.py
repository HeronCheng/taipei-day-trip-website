from flask import Blueprint,request,jsonify,current_app
from flask_cors import CORS
from cnxpool import cnxpool
from blueprint.definition import loops

attractions=Blueprint("attractions",__name__)

#取得景點資料列表
@attractions.route("/api/attractions",methods=["GET"])
def getattractions():
    current_app.config['JSON_SORT_KEYS'] = False
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()           
    keyword=request.args.get("keyword",None)
    page=request.args.get("page",None)
    if page == None and keyword != None:
        return jsonify({
            "error":True,
            "message":"400 客戶端錯誤"
        }),400
    elif keyword == None and page == None:
        return jsonify({
            "error":True,
            "message":"400 客戶端錯誤"
        }),400     
    elif keyword == None and page != None: 
        nextpage=str(int(page)+1)
        number=int(page)*12
        realPage=str(number)
        cursor.execute("SELECT count(*) FROM `attraction`;")
        result1=cursor.fetchall()
        allData=int(result1[0][0])
        pages=allData//12
        lastData=str(allData%12)
        if int(page)> pages:
            cursor.close()
            cnx.close()
            return jsonify({
                "error":True,
                "message":"500 伺服器內部錯誤"
            }),500
        else:    
            if int(page)==pages:
                nextpage=None
                cursor.execute("SELECT * FROM `attraction` LIMIT "+lastData+" OFFSET "+realPage+";")
                result=cursor.fetchall()
                cursor.close()
                cnx.close()
                return loops(a=int(lastData),result=result,nextpage=nextpage)
            else:
                cursor.execute("SELECT * FROM `attraction` LIMIT 12 OFFSET "+realPage+";")
                result=cursor.fetchall()
                cursor.close()
                cnx.close()
                return loops(a=12,result=result,nextpage=nextpage)            
    else:
        #取得關鍵字的景點列表
        nextpage=str(int(page)+1)
        number=int(page)*12
        realPage=str(number)  
        cursor.execute("SELECT count(*) FROM `attraction` WHERE `name` LIKE '%"+keyword+"%';")
        result1=cursor.fetchall()
        allData=int(result1[0][0])
        pages=allData//12
        lastData=str(allData%12)
        if int(page)>pages:
            return jsonify({
                "error":True,
                "message":"500 伺服器內部錯誤"
            }),500
        elif allData==0:
            return jsonify({
                "error":True,
                "message":"500 伺服器內部錯誤"
            }),500
        elif allData<12:
            nextpage=None
            cursor.execute("SELECT * FROM `attraction` WHERE `name` LIKE '%"+keyword+"%';")
            result=cursor.fetchall()
            cursor.close()
            cnx.close()
            return loops(a=allData,result=result,nextpage=nextpage)
        else:
            if int(page)==pages:
                nextpage=None
                cursor.execute("SELECT * FROM `attraction` WHERE `name` LIKE '%"+keyword+"%' LIMIT "+lastData+" OFFSET "+realPage+";")
                result=cursor.fetchall()
                cursor.close()
                cnx.close()
                return loops(a=int(lastData),result=result,nextpage=nextpage)
            else:
                cursor.execute("SELECT * FROM `attraction` WHERE `name` LIKE '%"+keyword+"%' LIMIT 12 OFFSET "+realPage+";")
                result=cursor.fetchall()
                cursor.close()
                cnx.close()
                return loops(a=12,result=result,nextpage=nextpage)
            