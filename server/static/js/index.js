let  denglu = document.querySelector(".dengluan");
let  subBtn = document.querySelector('.subBtn');
let mengceng = document.querySelector('.mengceng');
let cuo = document.querySelector('.cuo');
let zhanshi = document.querySelector('.zhanshi');
let left = document.querySelector('.left');
let right = document.querySelector('.right');
let sousuo  = document.querySelector('.sousuo');
let number = zhanshi.classList[1];
let HTTP_ROOT = 'http://localhost:8080';
let nu  =zhanshi.children.length;


subBtn.onclick = ()=>{
    mengceng.style.display = 'block';
}

cuo.onclick = ()=>{
    mengceng.style.display = 'none';
}
    
left.onclick = ()=>{
    let num = zhanshi.offsetLeft;
   if(!(num<-100*number) && nu>5){
    zhanshi.style.marginLeft = num-170 +'px';
   }
}
right.onclick = ()=>{
    let num = zhanshi.offsetLeft;
      if(num!=0 && nu>5){
        zhanshi.style.marginLeft = num+170 +'px';
      }
}

denglu.onclick = ()=>{

   ajax({
       url:`${HTTP_ROOT}/admin/login`,
       type:'get',
       data:{
          msg:'login'
       },
       success:()=>{
              window.location.href = '/admin/login'
       },
       error:()=>{

       }
   })
}

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