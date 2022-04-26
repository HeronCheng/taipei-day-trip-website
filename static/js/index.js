let next_page;
let data=null;
let loading=false;
let statusData;

//先載入首頁資料
getData(0);

//載入首頁資料函式
function getData(page){
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
    
    loading=true;
    fetch("/api/attractions?page="+page+"&keyword=")
    .then(function(response){
        return response.json();
    }).then(function(result){
        let url;
        next_page=result.nextPage;
        let fragment=document.createDocumentFragment();
        function length(obj) {
            return Object.keys(obj).length;
        }
        let datalength=length(result.data);
        for(i=0;i<datalength;i++){
            url=result.data[i].images[0];
            title=result.data[i].name;
            mrt=result.data[i].mrt;
            category=result.data[i].category;
            id=result.data[i].id;

            let bigdiv=document.createElement("div");
            let hyperlink=document.createElement("a");
            hyperlink.setAttribute("href","/attraction/"+id)
            let img=document.createElement("img");
            img.setAttribute("class","img2")
            img.setAttribute("id",id)
            img.src=url;
            fragment.appendChild(bigdiv);
            bigdiv.setAttribute("class","bigdiv");
            bigdiv.setAttribute("id","bigdiv");
            hyperlink.appendChild(img);
            bigdiv.appendChild(hyperlink);

            let pcTitle=document.createElement("div");
            let textnode=document.createTextNode(title);
            pcTitle.appendChild(textnode);
            pcTitle.setAttribute("class","pctitle");
            bigdiv.appendChild(pcTitle);

            let content=document.createElement("div");
            content.setAttribute("class","content")
            let content1=document.createElement("div");
            content1.setAttribute("class","mrt")
            let content2=document.createElement("div");
            content2.setAttribute("class","category")
            let textnode2_1=document.createTextNode(mrt);
            let textnode2_2=document.createTextNode(category);
            content1.appendChild(textnode2_1);
            content2.appendChild(textnode2_2);
            content.appendChild(content1);
            content.appendChild(content2);
            content.setAttribute("class","content");
            bigdiv.appendChild(content);
        }
        let target=document.getElementById("attractions");
        attractions.appendChild(fragment);  
        loading=false;
        document.querySelector("#loading").style.display="none";
}
)
    //首頁資料的scroll事件  
    if(data == null){
    document.addEventListener("scroll", lazyLoad)
    function lazyLoad() {
        if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight && loading==false) { 
            if (next_page==null){
                document.removeEventListener("scroll", lazyLoad);
            }
            else{getData(next_page)};
            }  
    }
    }
}

//回到最上面的按鈕函式
function backtotop(){
    window.scrollBy(0,-100);
    scrolldelay = setTimeout(backtotop,10);
    if(document.documentElement.scrollTop==0){
        clearTimeout(scrolldelay);
    }
}

//回到最上面按鈕的scroll事件
window.onscroll = ()=>{  
    if(document.documentElement.scrollTop>200){
        document.querySelector("#totopicon").style.display="block";
    }
    else{
        document.querySelector("#totopicon").style.display="none";
    }
}


//搜尋關鍵字後先把首頁資料移除
function remove(){
    let parent=document.getElementById("attractions");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
}    

//搜尋關鍵字後的結果
let queryNextpage;    
function query(anotherpage){
    next_page==null;
    data=document.getElementById("query").value;
    loading=true;
    fetch("/api/attractions?page="+anotherpage+"&keyword="+data)
    .then(function(response){
        return response.json();
    }).then(function(result){
        if(result.error==true){document.getElementById("attractions").innerHTML="查無景點資料";}
        let url;
        queryNextpage=result.nextPage;
        console.log(queryNextpage)
        let fragment=document.createDocumentFragment();
        function length(obj) {
            return Object.keys(obj).length;
        }
        let datalength=length(result.data);
        for(i=0;i<datalength;i++){
            url=result.data[i].images[0];
            title=result.data[i].name;
            mrt=result.data[i].mrt;
            category=result.data[i].category;
            id=result.data[i].id;

            let bigdiv=document.createElement("div");
            let hyperlink=document.createElement("a");
            hyperlink.setAttribute("href","/attraction/"+id)
            let img=document.createElement("img");
            img.setAttribute("class","img2");
            img.setAttribute("id",id)
            img.src=url;
            fragment.appendChild(bigdiv);
            bigdiv.setAttribute("class","bigdiv");
            hyperlink.appendChild(img);
            bigdiv.appendChild(hyperlink);

            let pcTitle=document.createElement("div");
            let textnode=document.createTextNode(title);
            pcTitle.appendChild(textnode);
            pcTitle.setAttribute("class","pctitle");
            bigdiv.appendChild(pcTitle);

            let content=document.createElement("div");
            content.setAttribute("class","content")
            let content1=document.createElement("div");
            content1.setAttribute("class","mrt")
            let content2=document.createElement("div");
            content2.setAttribute("class","category")
            let textnode2_1=document.createTextNode(mrt);
            let textnode2_2=document.createTextNode(category);
            content1.appendChild(textnode2_1);
            content2.appendChild(textnode2_2);
            content.appendChild(content1);
            content.appendChild(content2);
            content.setAttribute("class","content");
            bigdiv.appendChild(content);
        }
        let target=document.getElementById("attractions");
        attractions.appendChild(fragment);  
        loading=false;
}
)
    //關鍵字資料的scroll事件
    document.addEventListener("scroll", lazyLoad2)
    function lazyLoad2() {
        if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight && loading==false) {    
            console.log(data)
            if (queryNextpage==null){document.removeEventListener("scroll", lazyLoad2)}
            else{query(queryNextpage)};
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