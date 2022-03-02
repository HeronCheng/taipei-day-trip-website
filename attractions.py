from flask import Blueprint,request,jsonify,current_app
from cnxpool import cnxpool

Attractions=Blueprint("Attractions",__name__)

@Attractions.route("/api/attractions",methods=["GET"])
def attractions():
    current_app.config['JSON_SORT_KEYS'] = False
    cnx=cnxpool.get_connection()
    cursor=cnx.cursor()           
    keyword=request.args.get("keyword",None)
    page=request.args.get("page",None)  
    if page == None and keyword != None:
        return jsonify({
            "error":True,
            "message":"500 伺服器內部錯誤"
        }),500
    elif keyword == None and page == None:
        return jsonify({
            "error":True,
            "message":"500 伺服器內部錯誤"
        }),500
    elif keyword == None and page != None:
        if int(page)>4:
            return jsonify({
                "error":True,
                "message":"500 伺服器內部錯誤"
            }),500
        else:    
            nextpage=str(int(page)+1)
            number=int(page)*12
            realPage=str(number)
            if page=='4':
                a=10
                nextpage=None
                cursor.execute("SELECT * FROM `attraction` LIMIT 10 OFFSET "+realPage+";")
                result=cursor.fetchall()
                cursor.close()
                cnx.close()
            else:
                a=12
                cursor.execute("SELECT * FROM `attraction` LIMIT 12 OFFSET "+realPage+";")
                result=cursor.fetchall()
                cursor.close()
                cnx.close()
            i=0
            list=[]
            while i<a:
                id=int(result[i][0])
                name=result[i][1]
                category=result[i][2]
                description=result[i][3]
                address=result[i][4]
                transport=result[i][5]
                mrt=result[i][6]
                latitude=float(result[i][7])
                longitude=float(result[i][8])
                preImages=result[i][9]
                images=preImages.split(",")
                i+=1
                list1={
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
                list.append(list1.copy())
                text={
                    "nextPage": nextpage,
                    "data": list
                    }
                response=jsonify(text)    
            return(response)
    else:  
        cursor.execute("SELECT * FROM `attraction` WHERE `name` LIKE '%"+keyword+"%';")
        result=cursor.fetchall()
        length=len(result)
        pages=length//12
        lastData=length%12
        if int(page)>pages:
            return jsonify({
                "error":True,
                "message":"500 伺服器內部錯誤"
            }),500   
        elif length<12:
            cursor.close()
            cnx.close()
            i=0
            list=[]
            while i<length:
                id=int(result[i][0])
                name=result[i][1]
                category=result[i][2]
                description=result[i][3]
                address=result[i][4]
                transport=result[i][5]
                mrt=result[i][6]
                latitude=float(result[i][7])
                longitude=float(result[i][8])
                preImages=result[i][9]
                images=preImages.split(",")
                i+=1
                list1={
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
                list.append(list1.copy())
                text={
                    "nextPage": None,
                    "data": list
                    }
                response=jsonify(text)    
            return(response)
        else:
            if page==pages:
                a=lastData
                nextpage=None
                cursor.execute("SELECT * FROM `attraction` WHERE `name` LIKE '%"+keyword+"%' LIMIT"+lastData+"OFFSET"+realPage+";")
                result=cursor.fetchall()
            else:
                a=12
                cursor.execute("SELECT * FROM `attraction` WHERE `name` LIKE '%"+keyword+"%' LIMIT 12 OFFSET "+realPage+";")
                result=cursor.fetchall()
            cursor.close()
            cnx.close()
            i=0
            list=[]
            while i<a:
                id=int(result[i][0])
                name=result[i][1]
                category=result[i][2]
                description=result[i][3]
                address=result[i][4]
                transport=result[i][5]
                mrt=result[i][6]
                latitude=float(result[i][7])
                longitude=float(result[i][8])
                preImages=result[i][9]
                images=preImages.split(",")
                i+=1
                list1={
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
                list.append(list1.copy())
                text={
                    "nextPage": nextpage,
                    "data": list
                    }
                response=jsonify(text)    
            return(response)

