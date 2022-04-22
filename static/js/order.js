
checkStatus()

function checkStatus(){
    //檢查會員登入狀態
    let req=new XMLHttpRequest();
    req.open("get","/api/user");
    req.withCredentials = true;
    req.send();
    req.onload=function(){
        let statusData=JSON.parse(req.responseText);
        if(statusData.data==null){
            window.location.href = "/";
        }
        else{
            preSignin.style.display="none";
            afterSignin.style.display="block";
            username=statusData.data.name;
            user_name=document.getElementById("username");
            user_name.innerHTML=username;

            let url=location.href;
            let ary=url.split('/');
            let order_number=ary[4];
            let request=new XMLHttpRequest();
            request.open("get","/api/order/"+order_number);
            request.send();
            request.onload=function(){
                let data=JSON.parse(request.responseText);
                console.log(data.data)
                document.getElementById("total_fee").innerHTML=data.data["total_price"];
                document.getElementById("the_order").innerHTML=data.data["number"];
                document.getElementById("contactname").innerHTML=data.data["contact"]["name"];
                document.getElementById("contactemail").innerHTML=data.data["contact"]["email"];
                document.getElementById("contactnumber").innerHTML=data.data["contact"]["phone"];
                let trip=data.data["trip"];

                let fragment=document.createDocumentFragment();
                    
                trip.forEach(function(value, index, array){
                    //找出預定編號
                    datanumber=array[index].bookingnumber;
                    
                    let booking_data= document.createElement("div");
                    booking_data.setAttribute("class","booking_data");
                    booking_data.setAttribute("id","first"+datanumber);
                    let picture= document.createElement("div");
                    picture.setAttribute("class","picture");
                    let img=document.createElement("img");
                    img.setAttribute("class","picture2")
                    img.setAttribute("id","picture"+datanumber)
                    img.src=array[index].attraction.image;
                    fragment.appendChild(booking_data);
                    picture.appendChild(img);
                    booking_data.appendChild(picture);

                    let booking_text=document.createElement("div");
                    booking_text.setAttribute("class","booking_text");

                    let text1=document.createElement("div");
                    text1.setAttribute("class","text1");
                    let textnode1_1=document.createTextNode("台北一日遊：");
                    let b_title=document.createElement("span");
                    let textnode1_2=document.createTextNode(array[index].attraction.name);
                    b_title.appendChild(textnode1_2);
                    let b_id=document.createElement("span");
                    b_id.setAttribute("class","b_id");
                    let textnode1_3=document.createTextNode(array[index].attraction.id);
                    b_id.appendChild(textnode1_3);
                    text1.appendChild(textnode1_1);
                    text1.appendChild(b_title);
                    text1.appendChild(b_id);

                    let text2=document.createElement("div");
                    text2.setAttribute("class","text2");
                    let textnode2_1=document.createTextNode("日期：");
                    let b_date=document.createElement("span");
                    let textnode2_2=document.createTextNode(array[index].date);
                    b_date.appendChild(textnode2_2);
                    text2.appendChild(textnode2_1);
                    text2.appendChild(b_date);

                    let text3=document.createElement("div");
                    text3.setAttribute("class","text3");
                    let textnode3_1=document.createTextNode("時間：");
                    let b_time=document.createElement("span");
                    let textnode3_2=document.createTextNode(array[index].time);
                    b_time.appendChild(textnode3_2);
                    text3.appendChild(textnode3_1);
                    text3.appendChild(b_time);


                    let text4=document.createElement("div");
                    text4.setAttribute("class","text4");
                    let textnode4_1=document.createTextNode("費用：新台幣 ");
                    let b_fee=document.createElement("span");
                    let textnode4_2=document.createTextNode(array[index].singleprice);
                    let textnode4_3=document.createTextNode(" 元");
                    b_fee.appendChild(textnode4_2);
                    text4.appendChild(textnode4_1);
                    text4.appendChild(b_fee);
                    text4.appendChild(textnode4_3);

                    let text5=document.createElement("div");
                    text5.setAttribute("class","text5");
                    let textnode5_1=document.createTextNode("地點：");
                    let b_address=document.createElement("span");
                    let textnode5_2=document.createTextNode(array[index].attraction.address);
                    b_address.appendChild(textnode5_2);
                    text5.appendChild(textnode5_1);
                    text5.appendChild(b_address);                    

                    booking_text.appendChild(text1);
                    booking_text.appendChild(text2);
                    booking_text.appendChild(text3);
                    booking_text.appendChild(text4);
                    booking_text.appendChild(text5);
                    booking_data.appendChild(booking_text);
                });
                let bookingdata=document.getElementById("bookingdata");
                bookingdata.appendChild(fragment);  

                document.querySelector("#loading").style.display="none";
            }
        }
       
        
    }
}

//回到會員頁面
function tomember(){
    window.location.href = "/member";
}