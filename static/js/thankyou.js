
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
        }
    }
    document.querySelector("#loading").style.display="none";
}
let urlData=location.search;
let premsg=urlData.split("=");
let msg=premsg[1];
document.getElementById("orderNumber").innerHTML=msg

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

//進入會員頁面
function tomember(){
    window.location.href = "/member";
}