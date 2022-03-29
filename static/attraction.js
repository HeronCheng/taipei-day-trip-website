let id;
let number;
let datalength;
let preSignin=document.getElementById("preSignin");
let afterSignin=document.getElementById("afterSignin");
let statusData;

//計算json物件中的元素數量
function length(obj) {
    return Object.keys(obj).length;
}

//抓每一頁要呈現的資料
function getattraction(){
    //檢查會員登入狀態
    let req=new XMLHttpRequest();
    req.open("get","/api/user");
    req.withCredentials = true;
    req.send();
    req.onload=function(){
        statusData=JSON.parse(req.responseText);
        if(statusData.data != null){
            preSignin.style.display="none";
            afterSignin.style.display="block"
        }
        else{
            preSignin.style.display="block";
            afterSignin.style.display="none"
        }
    }
    
    let url=location.href;
    let ary=url.split('/');
    id=ary[4];
    fetch("http://18.180.51.21:3000/api/attraction/"+id)
    .then(function(response){
        return response.json();
    }).then(function(result){
        if(result.message=="400 景點編號不正確"){
            let upper=document.getElementById("upper");
            let line=document.getElementById("line");
            let lower=document.getElementById("lower");
            let footer=document.getElementById("footer");
            let nodatahere=document.getElementById("nodatahere");
            upper.innerHTML="";
            line.innerHTML="";
            lower.innerHTML="";
            footer.innerHTML="";
            footer.style.backgroundColor="white";
            nodatahere.innerHTML="查無此景點資料";
        }
        else{
            datalength=length(result.data.images);
        for(number=0;number<datalength ; number++){
            let picurl=result.data.images[number];
            let picurl2=document.createElement("img");
            picurl2.setAttribute("class","pic2")
            picurl2.setAttribute("id","id_"+number)
            picurl2.src=picurl;
            document.getElementById("pic");
            pic.appendChild(picurl2);

            let wtSpot=document.createElement("img");
            wtSpot.setAttribute("id","wtId"+number)
            wtSpot.setAttribute("class","wtspot");
            wtSpot.src="../static/white circle.png";
            let bkSpot=document.createElement("img");
            bkSpot.setAttribute("id","bkId"+number);
            bkSpot.setAttribute("class","bkspot");
            bkSpot.src="../static/circle current.png";
            document.getElementById("ball");
            ball.appendChild(wtSpot);
            ball.appendChild(bkSpot);
        }
        let title1=result.data.name;
        let title2=document.createTextNode(title1);
        let category1=result.data.category;
        let category2=document.createTextNode(category1);
        let mrt1=result.data.mrt;
        let mrt2=document.createTextNode(mrt1);
        let description1=result.data.description;
        let description2=document.createTextNode(description1);
        let address2=result.data.address;
        let address3=document.createTextNode(address2);
        let transport2=result.data.transport;
        let transport3=document.createTextNode(transport2);
        
        document.getElementById("titlename");
        titlename.appendChild(title2);
        document.getElementById("subtitle");
        subtitle.appendChild(category2);
        document.getElementById("mrt");
        mrt.appendChild(mrt2);
        subtitle.appendChild( mrt);
        document.getElementById("description");
        description.appendChild(description2);
        document.getElementById("address1");
        address1.appendChild(address3);
        document.getElementById("transport1");
        transport1.appendChild(transport3);
        }
    })
}




let white1=document.getElementById("white1");
let green1=document.getElementById("green1");
let white2=document.getElementById("white2");
let green2=document.getElementById("green2");
let money2000=document.getElementById("money2000");
let money2500=document.getElementById("money2500");
//選擇上下半天
function changetime1(){
    if (green1.style.display='inline-block'){
        white1.style.display='none';
        white2.style.display='inline-block';
        green2.style.display='none';
        money2000.style.display='inline-block';
        money2500.style.display='none';
    };
}
function changetime2(){
    if(white2.style.display='inline-block'){
        white1.style.display='inline-block';
        green1.style.display='none';
        white2.style.display='none';
        green2.style.display='inline-block';
        money2000.style.display='none';
        money2500.style.display='inline-block';
    }
}

//游標靠近與離開左右箭頭時
function enter1(){
    let pic3=document.getElementById("pic3");
    pic3.style.opacity="1";
}
function enter2(){
    let pic4=document.getElementById("pic4");
    pic4.style.opacity="1";
}
function leave1(){
    let pic3=document.getElementById("pic3");
    pic3.style.opacity="0.5";
}
function leave2(){
    let pic4=document.getElementById("pic4");
    pic4.style.opacity="0.5";
}

//圖片輪播處理
//播放下一張
let time=0;
let remainder;
function switchto2(){
    time++;
    remainder=(time%datalength);
    if (time>=0){
        if(remainder==0){
            let thisPic=document.getElementById("id_0");
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(datalength-1));
            prePic.style.display='none';
            let wtspot=document.getElementById("wtId"+(remainder));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(datalength-1));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(remainder));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(datalength-1));
            last_bkspot.style.cssText='display:none';
        }
        else{
            let thisPic=document.getElementById("id_"+remainder);
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(remainder-1));
            prePic.style.display='none';
            let wtspot=document.getElementById("wtId"+(remainder));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(remainder-1));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(remainder));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(remainder-1));
            last_bkspot.style.cssText='display:none';
        }
    }
    else{
        remainder=Math.abs(time%datalength);
        if(remainder==1){
            let thisPic=document.getElementById("id_"+(datalength-1));
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(datalength-2));
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId"+(datalength-1));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(datalength-2));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(datalength-1));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(datalength-2));
            last_bkspot.style.cssText='display:none';
        }
        else if(remainder==0){
            let thisPic=document.getElementById("id_0");
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(datalength-1));
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId0");
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(datalength-1));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId0");
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(datalength-1));
            last_bkspot.style.cssText='display:none';
        }
        else{
            let thisPic=document.getElementById("id_"+(datalength-remainder));
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(datalength-remainder-1));
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId"+(datalength-remainder));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(datalength-remainder-1));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(datalength-remainder));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(datalength-remainder-1));
            last_bkspot.style.cssText='display:none';
        }
    }
}

//播放上一張
function switchto1(){
    time--;
    if(time>=0){
        remainder=time%datalength;
        if(remainder==(datalength-1)){
            let thisPic=document.getElementById("id_"+remainder);
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_0");
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId"+remainder);
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId0");
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+remainder);
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId0");
            last_bkspot.style.cssText='display:none';
        }
        else{
            let thisPic=document.getElementById("id_"+remainder);
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(remainder+1));
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId"+(remainder));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(remainder+1));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(remainder));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(remainder+1));
            last_bkspot.style.cssText='display:none';
        }
    }
    else{
        remainder=Math.abs(time%datalength);
        if(remainder==1){
            let thisPic=document.getElementById("id_"+(datalength-remainder));
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_0");
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId"+(datalength-remainder));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId0");
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(datalength-remainder));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId0");
            last_bkspot.style.cssText='display:none';
        }
        else if(remainder==0){
            let thisPic=document.getElementById("id_0");
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_1");
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId0");
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId1");
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId0");
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId1");
            last_bkspot.style.cssText='display:none';
        }
        else{
            let thisPic=document.getElementById("id_"+(datalength-remainder));
            thisPic.style.display='inline-block';
            let prePic=document.getElementById("id_"+(datalength-remainder+1));
            prePic.style.display='none';

            let wtspot=document.getElementById("wtId"+(datalength-remainder));
            wtspot.style.cssText='display:none';
            let last_wtspot=document.getElementById("wtId"+(datalength-remainder+1));
            last_wtspot.style.cssText='display:inline-block';
            let bkspot=document.getElementById("bkId"+(datalength-remainder));
            bkspot.style.cssText='display:inline-block';
            let last_bkspot=document.getElementById("bkId"+(datalength-remainder+1));
            last_bkspot.style.cssText='display:none';
        }
    }
}



let signin=document.getElementById("signin")
let signup=document.getElementById("signup")
let dark=document.getElementById("dark")
//跳出登入視窗且背景轉暗
function tosignin_up(){
    signin.style.display="block";
    dark.style.display="block";
}

//切換註冊與登入介面
function toregister() {
    signin.style.display="none";
    signup.style.display="block";
}
function tosignin() {
    signin.style.display="block";
    signup.style.display="none";
}

//關閉登入視窗
function darkover(){
    signin.style.display="none";
    signup.style.display="none";
    dark.style.display="none";
}



//註冊處理
function goSignup(){
    let signup_username=document.getElementById("signup_username").value;
    let signup_email=document.getElementById("signup_email").value;
    let signup_password=document.getElementById("signup_password").value;
    let signup_message=document.getElementById("up_message");
    let boardSize=document.getElementById("signup");
    let request=new XMLHttpRequest();
    request.open("post","/api/user");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("signup_username="+signup_username+"&signup_email="+ signup_email+"&signup_password="+signup_password);
    request.onload=function(){
        let data=JSON.parse(request.responseText);
        if(data.ok==true){
            signup_message.style.display="block";
            boardSize.style.height="357px";
            signup_message.innerHTML="註冊成功";
        }
        else{
            signup_message.style.display="block";
            boardSize.style.height="357px";
            signup_message.innerHTML=data.message;
        }
    }
};


//登入處理
function goSignin(){
    let signin_email=document.getElementById("signin_email").value;
    let signin_password=document.getElementById("signin_password").value;
    let signin_message=document.getElementById("in_message");
    let boardSize=document.getElementById("signin");
    let request=new XMLHttpRequest();
    request.open("patch","/api/user");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("signin_email="+ signin_email+"&signin_password="+signin_password);
    request.onload=function(){
        let data=JSON.parse(request.responseText);
        if(data.ok==true){
            location.reload()
        }
        else{
            signin_message.style.display="block";
            boardSize.style.height="298px";
            signin_message.innerHTML=data.message;
        }
    }
}

//登出處理
function tosignin_out(){
    let signout_req=new XMLHttpRequest();
    signout_req.open("delete","/api/user");
    signout_req.withCredentials = true;
    signout_req.send();
    signout_req.onload=function(){
        let signoutData=JSON.parse(signout_req.responseText);
        if(signoutData!=null){
            preSignin.style.display="block";
            afterSignin.style.display="none"
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




//建立新的預定行程
function tobook(){
    if (statusData.data == null){
        signin.style.display="block";
        dark.style.display="block";
    }
    else{
        let url=location.href;
        let ary=url.split('/');
        attractionid=ary[4];
        let b_date=document.getElementById("date").value;
        let b_time;
        let b_fee;
        //檢查是按上半天還是下半天
        if (green1.style.display=='inline-block'){
            b_time="上半天";
            b_fee="2000";
        }
        else if(green1.style.display==""){
            b_time="上半天";
            b_fee="2000";
        }
        else{
            b_time="下半天";
            b_fee="2500";
        }
        let bookreq=new XMLHttpRequest();
        bookreq.open("post","/api/booking");
        bookreq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        bookreq.send("id="+attractionid+"&date="+b_date+"&time="+b_time+"&fee="+b_fee);
        bookreq.onload=function(){
            let status=JSON.parse(bookreq.responseText);
            if(status.ok==true){
                window.location.href = "/booking";
            }
        }
    }
    
}