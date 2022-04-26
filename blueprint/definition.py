from flask import jsonify    
    
    
def loops(a,result,nextpage):   
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
        answer=jsonify(text)    
    return(answer)
    