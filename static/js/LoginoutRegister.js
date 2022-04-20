let preSignin=document.getElementById("preSignin");
let afterSignin=document.getElementById("afterSignin");
let signin=document.getElementById("signin");
let signup=document.getElementById("signup");
let dark=document.getElementById("dark");
let booksuccess=document.getElementById("booksuccess");
let revise_window=document.getElementById("revise")


//跳出登入視窗且背景轉暗
function tosignin_up(){
    signin.style.display="block";
    dark.style.display="block";
    signin.style.animationDuration="500ms";
}


//切換註冊與登入介面
function toregister() {
    document.getElementById("signup_email_ok").style.display="none";
    document.getElementById("signup_email_notok").style.display="none";
    document.getElementById("signup_password_ok").style.display="none";
    document.getElementById("signup_password_notok").style.display="none";
    document.getElementById("signup_username_notok").style.display="none";
    document.getElementById("signup_username_ok").style.display="none";
    let i=0;
    while(i<6){
        document.getElementsByTagName('input')[i].value="";
        i++;
    }
    signin.style.display="none";
    signup.style.display="block";
}
function tosignin() {
    document.getElementById("signin_email_notok").style.display="none";
    document.getElementById("signin_email_ok").style.display="none";
    document.getElementById("signin_password_ok").style.display="none";
    document.getElementById("signin_password_notok").style.display="none";
    let i=0;
    while(i<6){
        document.getElementsByTagName('input')[i].value="";
        i++;
    }
    signin.style.animationDuration="0ms";
    signin.style.display="block";
    signup.style.display="none";
}

//關閉登入視窗
function darkover(){
    //關閉視窗前先把input的value清空
    let i=0;
    while(i<6){
        document.getElementsByTagName('input')[i].value="";
        i++;
    }
    //關視窗前先把驗證icon關掉
    document.getElementById("signin_email_notok").style.display="none";
    document.getElementById("signin_email_ok").style.display="none";
    document.getElementById("signup_email_ok").style.display="none";
    document.getElementById("signup_email_notok").style.display="none";
    document.getElementById("signin_password_notok").style.display="none";
    document.getElementById("signin_password_ok").style.display="none";
    document.getElementById("signup_password_ok").style.display="none";
    document.getElementById("signup_password_notok").style.display="none";
    document.getElementById("signup_username_notok").style.display="none";
    document.getElementById("signup_username_ok").style.display="none";
    signin.style.display="none";
    signup.style.display="none";
    dark.style.display="none";
    if(revise_window.style.display="block"){
        revise_window.style.display="none";
    }
    
    location.reload()
}

//attraction頁面的關閉登入視窗
function darkover2(){
    //關閉視窗前先把input的value清空
    let i=0;
    while(i<6){
        document.getElementsByTagName('input')[i].value="";
        i++;
    }
    //關視窗前先把驗證icon關掉
    document.getElementById("signin_email_notok").style.display="none";
    document.getElementById("signin_email_ok").style.display="none";
    document.getElementById("signup_email_ok").style.display="none";
    document.getElementById("signup_email_notok").style.display="none";
    document.getElementById("signin_password_notok").style.display="none";
    document.getElementById("signin_password_ok").style.display="none";
    document.getElementById("signup_password_ok").style.display="none";
    document.getElementById("signup_password_notok").style.display="none";
    document.getElementById("signup_username_notok").style.display="none";
    document.getElementById("signup_username_ok").style.display="none";
    dark.style.display="none";
    signin.style.display="none";
    signup.style.display="none";
    if (booksuccess.style.display=="block"){
        booksuccess.style.display="none";
        location.reload();
    }
}




// 前端進行輸入驗證
function verify(e){
    if (e.type == "email"){
        let email_pattern=/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/;
        let email_checker=email_pattern.test(e.value);
            if(email_checker == true & signin.style.display == "block"){
                document.getElementById("signin_email_notok").style.display="none";
                document.getElementById("signin_email_ok").style.display="block";
            }else if(email_checker == true & signin.style.display == "none"){
                document.getElementById("signup_email_ok").style.display="block";
                document.getElementById("signup_email_notok").style.display="none";
            }
            else{
                document.getElementById("signin_email_notok").style.display="block";
                document.getElementById("signin_email_ok").style.display="none";
                document.getElementById("signup_email_ok").style.display="none";
                document.getElementById("signup_email_notok").style.display="block";
            }
    }
    else if (e.type == "password"){
        let password_pattern=/^([\w\W]){1,16}$/;
        let password_checker=password_pattern.test(e.value);
        if(password_checker == true & signin.style.display == "block"){
            document.getElementById("signin_password_ok").style.display="block";
            document.getElementById("signin_password_notok").style.display="none";
        }else if(password_checker == true & signin.style.display == "none"){    
            document.getElementById("signup_password_ok").style.display="block";
            document.getElementById("signup_password_notok").style.display="none";
        }else{
            document.getElementById("signin_password_notok").style.display="block";
            document.getElementById("signin_password_ok").style.display="none";
            document.getElementById("signup_password_ok").style.display="none";
            document.getElementById("signup_password_notok").style.display="block";
        }
    }
    else{
        let name_pattern=/^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,16}$/;
        let name_checker=name_pattern.test(e.value);
        if(name_checker == true){
            document.getElementById("signup_username_ok").style.display="block";
            document.getElementById("signup_username_notok").style.display="none";
        }else{
            document.getElementById("signup_username_notok").style.display="block";
            document.getElementById("signup_username_ok").style.display="none";
        }
    }
}

//註冊處理
function goSignup(){
    event.preventDefault();
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
    event.preventDefault();
    let boardSize=document.getElementById("signin");
    let signin_email_data=document.getElementById("signin_email").value;
    let signin_password_data=document.getElementById("signin_password").value;
    let signin_message=document.getElementById("in_message");
    let request=new XMLHttpRequest();
    request.open("patch","/api/user");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("signin_email="+signin_email_data+"&signin_password="+signin_password_data);
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


//進入會員頁面
function tomember(){
    window.location.href = "/member";
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