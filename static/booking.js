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
            username=statusData.data.name;
            useremail=statusData.data.email;

            //抓取cookie中的資料
            let bookreq=new XMLHttpRequest();
            bookreq.open("get","/api/booking");
            bookreq.withCredentials = true;
            bookreq.send();
            bookreq.onload=function(){
                user_name=document.getElementById("username");
                user_name.innerHTML=username;
                bookData=JSON.parse(bookreq.responseText);
                if(bookData.data==null){
                    first.innerHTML="";
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
                    let pic=document.getElementById("picture");
                    pic.src=bookData.data.attraction.image;
                    let b_title=document.getElementById("b_title");
                    b_title.innerHTML=bookData.data.attraction.name;
                    let b_date=document.getElementById("b_date");
                    b_date.innerHTML=bookData.data.date;
                    let b_time=document.getElementById("b_time");
                    b_time.innerHTML=bookData.data.time;
                    let b_fee=document.getElementById("b_fee");
                    let total_fee=document.getElementById("total_fee");
                    b_fee.innerHTML=bookData.data.price;
                    total_fee.innerHTML=bookData.data.price;
                    let b_address=document.getElementById("b_address");
                    b_address.innerHTML=bookData.data.attraction.address;
                    let contactperson=document.getElementById("contactperson");
                    contactperson.value=username;
                    let contact_email=document.getElementById("contact_email");
                    contact_email.value=useremail;
                }
            }
        }
    }
}

//刪除預定行程
function deletebooking(){
    let delete_req=new XMLHttpRequest();
    delete_req.open("delete","/api/booking");
    delete_req.withCredentials = true;
    delete_req.send();
    delete_req.onload=function(){
        let deleteData=JSON.parse(delete_req.responseText);
        if(deleteData!=null){
            window.location.href = "/booking";
            user_name=document.getElementById("username");
            user_name.innerHTML=username;
            first.innerHTML="";
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
    }
}

//登出處理
function tosignin_out(){
    let delete_req=new XMLHttpRequest();
    delete_req.open("delete","/api/booking");
    delete_req.withCredentials = true;
    delete_req.send();
    delete_req.onload=function(){
        let signout_req=new XMLHttpRequest();
        signout_req.open("delete","/api/user");
        signout_req.withCredentials = true;
        signout_req.send();
        signout_req.onload=function(){
            let signoutData=JSON.parse(signout_req.responseText);
            if(signoutData!=null){
                window.location.href = "/";
            }
    }
    }
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