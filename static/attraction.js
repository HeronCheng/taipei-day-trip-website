let id;
let number;
let datalength;
//計算json物件中的元素數量
function length(obj) {
    return Object.keys(obj).length;
}
//抓每一頁要呈現的資料
function getattraction(){
    let url=location.href;
    let ary=url.split('/');
    id=ary[4];
    fetch("http://18.180.51.21:3000/api/attraction/"+id)
    .then(function(response){
        return response.json();
    }).then(function(result){
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
    })
}
//選擇上下半天
function changetime1(){
    //預設是綠色的
    let white1=document.getElementById("white1");
    let green1=document.getElementById("green1");
    let white2=document.getElementById("white2");
    let green2=document.getElementById("green2");
    let money2000=document.getElementById("money2000");
    let money2500=document.getElementById("money2500");
    if (green1.style.display='inline-block'){
        white1.style.display='none';
        white2.style.display='inline-block';
        green2.style.display='none';
        money2000.style.display='inline-block';
        money2500.style.display='none';
    };
}
function changetime2(){
    let white2=document.getElementById("white2");
    let green2=document.getElementById("green2");
    let white1=document.getElementById("white1");
    let green1=document.getElementById("green1");
    let money2000=document.getElementById("money2000");
    let money2500=document.getElementById("money2500");
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