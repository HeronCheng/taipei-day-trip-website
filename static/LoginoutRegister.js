let preSignin=document.getElementById("preSignin");
let afterSignin=document.getElementById("afterSignin");
let signin=document.getElementById("signin");
let signup=document.getElementById("signup");
let dark=document.getElementById("dark");
let booksuccess=document.getElementById("booksuccess");

//跳出登入視窗且背景轉暗
function tosignin_up(){
    signin.style.display="block";
    dark.style.display="block";
    signin.style.animationDuration="500ms";
}


//切換註冊與登入介面
function toregister() {
    signin.style.display="none";
    signup.style.display="block";
}
function tosignin() {
    signin.style.animationDuration="0ms";
    signin.style.display="block";
    signup.style.display="none";
}

//關閉登入視窗
function darkover(){
    signin.style.display="none";
    signup.style.display="none";
    dark.style.display="none";
    booksuccess.style.display="none";
    location.reload()
}
//attraction頁面的關閉登入視窗
function darkover2(){
    dark.style.display="none";
    signin.style.display="none";
    signup.style.display="none";
    if (booksuccess.style.display=="block"){
        booksuccess.style.display="none";
        location.reload();
    }
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
                preSignin.style.display="block";
                afterSignin.style.display="none"
            }
    }
    }
}


//訂購成功視窗之後續處理

//繼續預定其他行程
function booknext(){
    dark.style.display="none";
    booksuccess.style.display="none";
    window.location.href = "/";
}

//前往結帳付款頁面
function bookover(){
    window.location.href = "/booking";
}