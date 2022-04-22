let username;
let useremail;
let statusData;
let user_name;
let first=document.getElementById("first");
let first_part=document.getElementById("first_part");
let line1=document.getElementById("line1");
let line2=document.getElementById("line2");
let line3=document.getElementById("line3");
let second=document.getElementById("second");
let third=document.getElementById("third");
let forth=document.getElementById("forth");
let nodatahere=document.getElementById("nodatahere");
let footer=document.getElementById("footer");

//抓頁面資料
checkStatus()

function checkStatus(){
    //檢查會員登入狀態
    let req=new XMLHttpRequest();
    req.open("get","/api/user");
    req.withCredentials = true;
    req.send();
    req.onload=function(){
        statusData=JSON.parse(req.responseText);
        if(statusData.data==null){
            window.location.href = "/";
        }
        else{
            preSignin.style.display="none";
            afterSignin.style.display="block"
            //檢查購物車內的數量
            let req=new XMLHttpRequest();
            req.open("get","/api/booking");
            req.send();
            req.onload=function(){
            preData=JSON.parse(req.responseText);
            let count=preData.count;
            if(count != null){
                let img=document.createElement("img");
                img.setAttribute("class","bookcarticon");
                img.src="/static/pic/icons"+count+".png"
                let position=document.getElementById("righttitle1");
                position.appendChild(img);
                position.style.marginRight="25px";
            }
            }

            username=statusData.data.name;
            useremail=statusData.data.email;

            //抓取後端回傳的購物車資料
            let bookreq=new XMLHttpRequest();
            bookreq.open("get","/api/booking");
            bookreq.withCredentials = true;
            bookreq.send();
            bookreq.onload=function(){
                user_name=document.getElementById("username");
                user_name.innerHTML=username;
                prebookData=JSON.parse(bookreq.responseText);
                let bookData=prebookData.data;
                if(bookData==null){
                    // first.innerHTML="";
                    first_part.style.height="220px";
                    line1.style.display="none";
                    line2.style.display="none";
                    line3.style.display="none";
                    second.innerHTML="";
                    second.style.display="none";
                    third.innerHTML="";
                    third.style.display="none";
                    forth.innerHTML="";
                    forth.style.display="none";
                    nodatahere.style.display="block";
                    nodatahere.innerHTML="目前沒有任何待預訂的行程";
                    footer.style.height="865px";
                    document.querySelector("#loading").style.display="none";
                }
                else{
                    let fragment=document.createDocumentFragment();
                    let sum=0;
                    bookData.forEach(function(value, index, array){
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
                        let textnode4_2=document.createTextNode(array[index].price);
                        let textnode4_3=document.createTextNode(" 元");
                        b_fee.appendChild(textnode4_2);
                        text4.appendChild(textnode4_1);
                        text4.appendChild(b_fee);
                        text4.appendChild(textnode4_3);
                        sum+=(array[index].price);

                        let text5=document.createElement("div");
                        text5.setAttribute("class","text5");
                        let textnode5_1=document.createTextNode("地點：");
                        let b_address=document.createElement("span");
                        let textnode5_2=document.createTextNode(array[index].attraction.address);
                        b_address.appendChild(textnode5_2);
                        text5.appendChild(textnode5_1);
                        text5.appendChild(b_address);

                        let delete_icon=document.createElement("img");
                        delete_icon.src="/static/pic/icon_delete.png";
                        delete_icon.setAttribute("class","delete_icon")
                        delete_icon.setAttribute("id","delete_icon"+datanumber)
                        delete_icon.setAttribute("onclick","deletebooking("+datanumber+")");
                        

                        booking_text.appendChild(text1);
                        booking_text.appendChild(text2);
                        booking_text.appendChild(text3);
                        booking_text.appendChild(text4);
                        booking_text.appendChild(text5);
                        booking_text.appendChild(delete_icon);
                        booking_data.appendChild(booking_text);
                    });
                    let bookingdata=document.getElementById("bookingdata");
                    bookingdata.appendChild(fragment);  

                    let contactperson=document.getElementById("contactperson");
                    contactperson.value=username;
                    let contact_email=document.getElementById("contact_email");
                    contact_email.value=useremail;
                    let total_fee=document.getElementById("total_fee");
                    total_fee.innerHTML=sum;
                    document.querySelector("#loading").style.display="none";
                }
            }
        }
    }
}

//刪除預定行程
function deletebooking(number){
    let delete_req=new XMLHttpRequest();
    delete_req.open("delete","/api/booking");
    delete_req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    delete_req.send("booking_number="+number);
    delete_req.onload=function(){
        let deleteData=JSON.parse(delete_req.responseText);
        if(deleteData.booknumber==0){
            document.querySelector("#loading").style.display="flex";
            location.reload()
            user_name=document.getElementById("username");
            user_name.innerHTML=username;
            first_part.style.height="220px";
            line1.style.display="none";
            line2.style.display="none";
            line3.style.display="none";
            second.innerHTML="";
            second.style.display="none";
            third.innerHTML="";
            third.style.display="none";
            forth.innerHTML="";
            forth.style.display="none";
            nodatahere.style.display="block";
            nodatahere.innerHTML="目前沒有任何待預訂的行程";
            footer.style.height="865px";
            
        }
        else{
            let deletepart=document.getElementById("first"+number);
            deletepart.style.display="none";
        }
    }
}

//進入會員頁面
function tomember(){
    window.location.href = "/member";
}

//點選導覽列的 預定行程 處理
function trytobook(){
    if (statusData.data == null){
        signin.style.display="block";
        dark.style.display="block";
    }
    else{
        window.location.href = "/booking";
    }
}

