let  list = document.querySelectorAll('.list');
let fen = document.querySelectorAll('.fen');
let ye = document.querySelectorAll('.ye');
let stateChange = document.querySelectorAll('.stateChange');
let stateList  = document.querySelectorAll('.stateList');
let solve = document.querySelectorAll('.solve');
let fail = document.querySelectorAll('.fail');
let content_left = document.querySelector('.content_left');
let signout = document.querySelector('.signout');
let HTTP_ROOT = 'http://localhost:8080';

function ajax (obj) {
   // type 请求方式, url 地址, params 参数, fun 回调函数
     obj.type = obj.type.toUpperCase()            //在传入type的时候可以忽略大小写
     var xhr = new XMLHttpRequest();
     var timer = null;
   //参数也可以指直接写字符串形式 不能是汉字
     if (typeof obj.data === 'object') {        //如果在地址传入的东西是一个对象，我们将它的格式转化为urlencoded
       var tempArr = []
       for (var key in obj.data) {
         var value = obj.data[key]
         tempArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
       }
     obj.data = tempArr.join('&') //===>这里的格式就为parsms=[key1=value&key2=value2]
     }
 
     if (obj.type === 'GET') {
       obj.url += '?' + obj.data;
       xhr.open(obj.type, obj.url+"&t="+new Date().getTime(), true)
       xhr.send();
     }
 
     //true代表异步
 
 
     if (obj.type === 'POST') {    //如果请求的方式为POST，需要手动设置请求头的Content-Type
         xhr.open(obj.type, obj.url+"&t="+new Date().getTime(), true)
       xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
 
       xhr.send(obj.data);
     }
 
     xhr.onreadystatechange = function () {
       if (this.readyState === 4) {
           clearTimeout(timer);
        if(this.status >=200 && this.status<300 || this.status == 304){
         obj.success(this.responseText);
        }else{
            obj.error();
        }
       }
     }
 
     
     // 处理超时
     if(obj.time){
         timer = setTimeout(xhr.abort,obj.time)
     }
   }
 
[].slice.call(list).forEach(list=>{
    let flag = false;
 list.onclick = (e)=>{
   let target = e.target;
 
 if(target.className == 'anniu'){
     if(!flag){
        list.nextElementSibling.style.display = 'block';
        flag = true;
     }else{
        list.nextElementSibling.style.display = 'none';
        flag = false;
     }  
    }
 }
});

fen = [].slice.call(fen)

for(let i = 0;i<fen.length;i++){


 fen[i].onclick = ()=>{
  
   fen.forEach((item)=>{
      item.style.background = 'white';
   })
   fen[i].style.background = 'yellow';
   [].slice.call(ye).forEach((ite,ind)=>{
   
      if(ind!=i){
         ye[ind].style.display = 'none';
      }else{
         ye[ind].style.display = 'block';
      }
     
   });
 }


}

[].slice.call(stateChange).forEach((stateChange,index)=>{
 
   stateChange.onmouseover = ()=>{
      stateList[index].style.display = 'block';
      }
      stateChange.onmouseout = ()=>{
         stateList[index].style.display = 'none';
      }
});
[].slice.call(stateList).forEach((stateList)=>{
   stateList.onmouseover = ()=>{
      stateList.style.display = 'block';
   }
   stateList.onmouseout = ()=>{
      stateList.style.display = 'none';
   }
});

[].slice.call(solve).forEach((solve)=>{
   solve.onclick = ()=>{
      let Onumber = solve.parentElement.parentElement.className.split(' ')[1];
      console.log(Onumber)
      ajax({
         type:'get',
         url:`${HTTP_ROOT}/admin/change/solve`,
         data:{
            num:Onumber
         },
         success:function(){
            alert('成功');
         }
      })
   }
});

[].slice.call(fail).forEach((fail)=>{
   fail.onclick = ()=>{
      let Onumber = fail.parentElement.parentElement.className.split(' ')[1];
      
      ajax({
         type:'get',
         url:`${HTTP_ROOT}/admin/change/fail`,
         data:{
            num:Onumber
         },
         success:function(){
            alert('成功')
         }
      })
   }
})


