let next_page;
let data=null;
let loading=false;
function getData(page){
    loading=true;
    fetch("http://18.180.51.21:3000/api/attractions?page="+page+"&keyword=")
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
}
)
}
     
// function debounce(func, delay=250) {
//     let timer = null;
   
//     return () => {
//       let context = this;
//       let args = arguments;
   
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//         func.apply(context, args);
//       }, delay)
//     }
//   }
  
if (data == null){
document.addEventListener("scroll", lazyLoad)
function lazyLoad() {
    if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight && loading==false) {                
        if (next_page==null){document.removeEventListener("scroll", lazyLoad)}
        else{getData(next_page);console.log(next_page)};
        }  
    }
}

function remove(){
    let parent=document.getElementById("attractions");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
}    

let queryNextpage;    
function query(anotherpage){
    next_page==null;
    data=document.getElementById("query").value;
    loading=true;
    fetch("http://18.180.51.21:3000/api/attractions?page="+anotherpage+"&keyword="+data)
    .then(function(response){
        return response.json();
    }).then(function(result){
        if(result.error==true){document.getElementById("attractions").innerHTML="查無景點資料";}
        let url;
        queryNextpage=result.nextPage;
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

            let img=document.createElement("img");
            img.setAttribute("class","img2");
            img.setAttribute("id",id)
            img.src=url;
            fragment.appendChild(bigdiv);
            bigdiv.setAttribute("class","bigdiv");
            bigdiv.appendChild(img);

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
}

document.addEventListener("scroll", lazyLoad2)
function lazyLoad2() {
    if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight && loading==false) {                
        if (queryNextpage==null){document.removeEventListener("scroll", lazyLoad2)}
        else{query(queryNextpage);console.log(queryNextpage)};
        }  
    }

