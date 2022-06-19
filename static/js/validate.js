//串聯金流

//設定金鑰
TPDirect.setupSDK(123991, "app_eO4aZnOX5DiTmlO4zfb2FilOYSZQoZUPHDK4Z5MMvtID9Q2yYfyoDVg0nJid", 'sandbox');

//信用卡號碼每四個數字空一格
// document.getElementById("card-number").onkeyup=function(){
//     let data=this.value
//     let check=/[a-z]/gi; 
//     if (check.test(data)==true){
//         data=data.replace(check,'');
//         document.getElementById("card-number").value=data;
//     }
//     else{
//         if (data.length == 4 | data.length == 9 | data.length == 14){
//             data=data+" ";
//         }
//         document.getElementById("card-number").value=data;
//     }    
// }

TPDirect.card.setup({
    fields: {
        number: {
            element: '.form-control.card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('tappay-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '.form-control.cvc',
            placeholder: 'CVC'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'black'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
    }
})


let submitButton = document.querySelector('#certain')
//得到卡片資訊的輸入狀態
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
    }

    /* Change card type display when card type change */
    /* ============================================== */
    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    let newType = update.cardType === 'unknown' ? '' : update.cardType;
    // document.querySelector('#cardtype').innerHTML=newType;

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number')
    } else {
        setNumberFormGroupToNormal('.card-number')
    }

    if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date')
    } else {
        setNumberFormGroupToNormal('.expiration-date')
    }

    if (update.status.cvc === 2) {
        setNumberFormGroupToError('.cvc')
    } else if (update.status.cvc === 0) {
        setNumberFormGroupToSuccess('.cvc')
    } else {
        setNumberFormGroupToNormal('.cvc')
    }
})


function setNumberFormGroupToError(selector) {
    document.querySelector(selector).classList.add('has-error')
    document.querySelector(selector).classList.remove('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    document.querySelector(selector).classList.remove('has-error')
    document.querySelector(selector).classList.add('has-success')
}

function setNumberFormGroupToNormal(selector) {
    document.querySelector(selector).classList.remove('has-error')
    document.querySelector(selector).classList.remove('has-success')
}

function forceBlurIos() {
    if (!isIos()) {
        return
    }
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input)
    input.focus()
    input.parentNode.removeChild(input)
}

function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}


// call TPDirect.card.getPrime when user submit form to get tappay prime
function gopay(){
    event.preventDefault()

    // fix keyboard issue in iOS device
    forceBlurIos()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        console.log('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg)
            return
        }
        console.log('get prime 成功，prime: ' + result.card.prime)

        
        //檢查購物車內的數量
        let request=new XMLHttpRequest();
        
        request.open("get","/api/booking");
        request.send();
        request.onload=function(){
        let list=[];
        let preData=JSON.parse(request.responseText);
        data=preData.data
        data.forEach(function(value, index, array){
            let b_number=array[index].bookingnumber;
            let b_title=array[index].attraction.name;
            let b_id=array[index].attraction.id;
            let b_date=array[index].date;
            let b_time=array[index].time;
            let b_fee=array[index].price;
            let b_address=array[index].attraction.address;
            let picture=array[index].attraction.image;
            let prelist={
                "attraction": {
                  "id": b_id,
                  "name": b_title,
                  "address": b_address,
                  "image": picture
                },
                "bookingnumber": b_number,
                "date": b_date,
                "time": b_time,
                "singleprice": b_fee
              }
            
            list.push(prelist);
        }); 
        let total_fee=document.getElementById("total_fee").innerHTML;
        let b_name=document.getElementById("contactperson").value;
        let b_email=document.getElementById("contact_email").value;
        let b_tel=document.getElementById("contact_tel").value;
        
        let partnerkey;
        let merchantid;
        let command ={
            "partner_key": partnerkey,
            "prime": result.card.prime,
            "merchant_id": merchantid,
            "order": {
                "price": total_fee,
                "trip": list,
                "contact": {
                  "name": b_name,
                  "email": b_email,
                  "phone": b_tel
                }
              }
        }
        
        //把資料傳到後端
        let req=new XMLHttpRequest();
        req.open("post","/api/orders");
        req.setRequestHeader("Content-type", "application/json");
        req.setRequestHeader("x-api-key", "partner_WqSEiq2i5THFTkJcimYrlQR9oQ1nMhk0tFlcSLxXLzAKtdhjUAgQUSDw");
        req.send(JSON.stringify(command));
        req.onload=function(){
            let result=JSON.parse(req.responseText);
            orderNumber=result.data.number;
            window.location.href = "/thankyou?number="+orderNumber;
        }
        } 
    })
}

