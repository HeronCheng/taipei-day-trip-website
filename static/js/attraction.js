let id;
let number;
let datalength;
let statusData;

//抓每一頁要呈現的資料
getattraction()

//設定不行輸入過去日期
let date_now=new Date();
let year=date_now.getFullYear();
let month=date_now.getMonth()+1 < 10 ? "0"+(date_now.getMonth()+1) : (date_now.getMonth()+1)
let date=date_now.getDate() < 10 ? "0"+ (date_now.getDate()) : (date_now.getDate())
document.getElementById("date").setAttribute("min",year+"-"+month+"-"+date);

//計算json物件中的元素數量
function length(obj) {
    return Object.keys(obj).length;
}

//抓每頁資料的函式
function getattraction(){
    //檢查會員登入狀態
    let preSignin=document.getElementById("preSignin");
    let afterSignin=document.getElementById("afterSignin");
    let req=new XMLHttpRequest();
    req.open("get","/api/user");
    req.withCredentials = true;
    req.send();
    req.onload=function(){
        statusData=JSON.parse(req.responseText);
        if(statusData.data != null){
            preSignin.style.display="none";
            afterSignin.style.display="block"

            //檢查購物車內的數量
            let bookreq=new XMLHttpRequest();
            bookreq.open("get","/api/booking");
            bookreq.send();
            bookreq.onload=function(){
            prebookData=JSON.parse(bookreq.responseText);
            let count=prebookData.count;
            if(count != null){
                let img=document.createElement("img");
                img.setAttribute("class","bookcarticon");
                img.src="/static/pic/icons"+count+".png"
                let position=document.getElementById("righttitle1");
                position.appendChild(img);
                position.style.marginRight="25px";
            }
            }
        }
        else{
            preSignin.style.display="block";
            afterSignin.style.display="none"
        }
    }
    
    let url=location.href;
    let ary=url.split('/');
    id=ary[4];
    fetch("/api/attraction/"+id)
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
            line.style.display="none";
            lower.innerHTML="";
            footer.innerHTML="";
            footer.style.backgroundColor="white";
            nodatahere.innerHTML="查無此景點資料";
            document.querySelector("#loading").style.display="none";
        }
        else{
            datalength=length(result.data.images);
        for(number=0;number<datalength ; number++){
            let picurl=result.data.images[number];
            let picurl2=document.createElement("img");
            picurl2.setAttribute("class","pic2")
            picurl2.setAttribute("id","id_"+number)
            picurl2.setAttribute("id","id_"+number)
            picurl2.src=picurl;
            document.getElementById("pic");
            pic.appendChild(picurl2);

            let wtSpot=document.createElement("img");
            wtSpot.setAttribute("id","wtId"+number)
            wtSpot.setAttribute("class","wtspot");
            wtSpot.src="/static/pic/white circle.png";
            let bkSpot=document.createElement("img");
            bkSpot.setAttribute("id","bkId"+number);
            bkSpot.setAttribute("class","bkspot");
            bkSpot.src="/static/pic/circle current.png";
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
        document.querySelector("#loading").style.display="none";
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
    event.preventDefault()
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
               document.getElementById("booksuccess").style.display="block";
               document.getElementById("dark").style.display="block";
            }
            else if(status.message=="建立失敗"){
               document.getElementById("booksuccess").style.display="block";
               document.getElementById("dark").style.display="block";
               document.getElementById("bs_1").innerHTML="預定失敗";
               document.getElementById("bs_2").innerHTML="已達預定數量上限";
               document.getElementById("bs_2").setAttribute("class","switch2")
               document.getElementById("bs_3").innerHTML="查看您的預定頁面";
            }
        }
    }
    
}