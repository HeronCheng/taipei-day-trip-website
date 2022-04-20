let userpassword;
let oldorder_number;
let this_ordernumber;

//設定網址參數
const url = new URL(location.href);
url.searchParams.set('random', Math.random());
history.pushState(null, '', url);

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
            afterSignin.style.display="block";
            let username=statusData.data.name;
            let useremail=statusData.data.email;
            userpassword=statusData.data.password;
            document.getElementById("member_name").innerHTML=username;
            document.getElementById("member_email").innerHTML=useremail;

            let request=new XMLHttpRequest();
            request.open("get","/api/orders");
            request.withCredentials = true;
            request.send();
            request.onload=function(){
                preorderData=JSON.parse(request.responseText);
                orderData=preorderData.data;
                oldorder_number=orderData.length;
                if(oldorder_number<5){
                    get_oldorder(0,oldorder_number);
                }
                else{
                    get_oldorder(0,5);
                    document.getElementById("pic4").style.display="block";
                }
            }
        }
    }
    document.querySelector("#loading").style.display="none";
}

//取得歷史訂單
function get_oldorder(start,howmany){
    for(let index=start; index<howmany; index++){
        let row=document.createElement("tr");
        this_ordernumber=orderData[index]["number"]
        row.setAttribute("id",this_ordernumber)
        let column1=document.createElement("td");
        let column2=document.createElement("td");
        let column3=document.createElement("td");
        let column4=document.createElement("td");
        let hyperlink=document.createElement("a");
        hyperlink.setAttribute("href","/order/"+orderData[index]["number"]);
        column1.innerHTML=orderData[index]["number"];
        column2.innerHTML=orderData[index]["total_price"]+"元";
        if(orderData[index]["status"]==0){
            column3.innerHTML="已付款";
        }else{
            column3.innerHTML="未付款";
        }
        let column4_link=document.createElement("div");
        column4_link.innerHTML="查看訂單詳細";
        hyperlink.appendChild(column4_link);
        column4.appendChild(hyperlink);
        row.appendChild(column1);
        row.appendChild(column2);
        row.appendChild(column3);
        row.appendChild(column4);
        let table=document.getElementById("table");
        table.appendChild(row);
    };
}


//當訂單數大於5筆時，可以按向右箭頭查詢更早的訂單
let time=0;
function gonext(){
    time++
    document.getElementById("pic3").style.display="block";
    let request=new XMLHttpRequest();
        request.open("get","/api/orders");
        request.withCredentials = true;
        request.send();
        request.onload=function(){
            preorderData=JSON.parse(request.responseText);
            orderData=preorderData.data;
            oldorder_number=orderData.length;
            //把前一頁的資料清空
            for(let i=(time-1)*5; i<(time-1)*5+5; i++){
                let obj = document.getElementById(orderData[i]["number"]);
                let parentObj = obj.parentNode;
                parentObj.removeChild(obj);
            }
            if((oldorder_number-(time*5))<5){
                get_oldorder(time*5,time*5+(oldorder_number-(time*5)));
                document.getElementById("pic4").style.display="none";
            }
            else{
                get_oldorder(time*5,(time*5)+5);
            }
        }
}

//箭頭向左回去檢視較近的訂單
function backto(){
    time--;
    document.getElementById("pic4").style.display="block";
    let request=new XMLHttpRequest();
        request.open("get","/api/orders");
        request.withCredentials = true;
        request.send();
        request.onload=function(){
            preorderData=JSON.parse(request.responseText);
            orderData=preorderData.data;
            oldorder_number=orderData.length;
            //把後一頁的資料清空
            for(let i=(time+1)*5; i<((time+1)*5+(oldorder_number-((time+1)*5))); i++){
                let obj = document.getElementById(orderData[i]["number"]);
                let parentObj = obj.parentNode;
                parentObj.removeChild(obj);
            }
            if(time==0){
                document.getElementById("pic3").style.display="none";
            }
            get_oldorder(time*5,(time*5)+5);
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


let secret=document.getElementById("secret");
let see=document.getElementById("see");
//切換密碼可見/不可見
function tosee(){
    secret.style.display="none";
    see.style.display="inline-block";
    document.getElementById("member_password_inside").innerHTML=userpassword;
}
function nottosee(){
    secret.style.display="inline-block";
    see.style.display="none";
    document.getElementById("member_password_inside").innerHTML="✽✽✽✽✽";
}


let revise_window=document.getElementById("revise")
//修改密碼視窗
function tomodify(){
    revise_window.style.display="block";
    dark.style.display="block";
}

//關閉登入視窗
function darkover3(){
    //關閉視窗前先把input的value清空
    let i=0;
    while(i<6){
        document.getElementsByTagName('input')[i].value="";
        i++;
    }
    //關視窗前先把驗證icon關掉
    document.getElementById("signin_email_notok").style.display="none";
    document.getElementById("signin_email_ok").style.display="none";
    document.getElementById("signin_password_notok").style.display="none";
    document.getElementById("signin_password_ok").style.display="none"
    dark.style.display="none";
    revise_window.style.display="none";

    location.reload()
}

//修改密碼
function gorevise(){
    event.preventDefault();
    let modify_password=document.getElementById("modify_password").value;
    let modify_password2=document.getElementById("modify_password2").value;
    let revise_message=document.getElementById("revise_message");
    let revisereq=new XMLHttpRequest();
    revisereq.open("patch","/api/users");
    revisereq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    revisereq.send("modify_password="+modify_password+"&modify_password2="+ modify_password2);
    revisereq.onload=function(){
        let data=JSON.parse(revisereq.responseText);
        if(data.ok==true){
            revise_message.style.display="block";
            revise_message.innerHTML="修改成功";
        }
        else{
            revise_message.style.display="block";
            revise_message.innerHTML=data.message;
        }
    }
}