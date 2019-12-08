const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const common = require('../../libs/common');

let router = new Router();

router.post('/sub',async ctx=>{
    let {HTTP_ROOT} = ctx.config;
    function random(n){
        let str = '1234567890';
        let arr = [];
        while(n--){
           arr.push(str[parseInt(Math.random()*10)]);
        }
       return  arr.join('');
    }
    let {title,describe,address,src,name,phone} = ctx.request.fields;
       src =  path.basename(src[0].path);
       let num = random(5);

       await ctx.db.query(`INSERT INTO admin_table (titleA,describeA,address,srcA,stateA,onA,phone,name) VALUES(?,?,?,?,?,?,?,?)`,[title,describe,address,src,'未解决',num,phone,name])
       ctx.body = `提交成功！编码：${num}  请记住维修单号随时查看维修状态`
})
router.get('/login',async ctx=>{
   
    let {HTTP_ROOT} = ctx.config;
    if(ctx.session['admin']){
        ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/banner`);
     }else{
        await ctx.render('admin/login',{
            HTTP_ROOT
          });
     }
   
})
router.get('/signout',async ctx=>{
    ctx.session['admin'] = '';
    ctx.body = '您已成功退出';
})
router.post('/login',async ctx=>{
    let {username, password} = ctx.request.fields;
    let {HTTP_ROOT} = ctx.config;
    let admins = JSON.parse(fs.readFileSync(
        path.resolve(__dirname,'../../admins.json')
        ).toString()) 
        
    function findAdmin(user){
        let a = null;
        admins.forEach(item=>{
            if(item.username == user){
                   a = item;
            }
        })
        return a;
    }    
    
    if(!findAdmin(username)){
        ctx.body = "bcz";
        //ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('用户不存在')}`)
    }else if(findAdmin(username).password!=common.md5(password)){
       // ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('密码错误')}`)
       ctx.body = 'cw';
    }else{

        ctx.session['admin'] = username;
        ctx.redirect(`${HTTP_ROOT}/admin/banner`)

    }
    
    //ctx.body = admins.length;
})
router.get('/details:id',async ctx=>{
    let {id} = ctx.params;
       id = id.slice(1);
    let {HTTP_ROOT} = ctx.config;
    let datas =  await ctx.db.query(`SELECT * FROM admin_table WHERE onA=?`,[id]);
  
    await ctx.render('admin/zt',{
        data:datas[0],
        HTTP_ROOT,
        ret:'gl'
    })
    
})
router.all('*',async (ctx,next)=>{
    if(!ctx.session['admin']){
       ctx.redirect(`${ctx.config.HTTP_ROOT}`);
    }else{
        await next();
    }
})
router.get('/banner',async ctx=>{
  let datas =  await ctx.db.query(`SELECT * FROM admin_table`);
  let {HTTP_ROOT} = ctx.config;
  let dataArr = [];
  let msg = 'all';
  function chai(data){
      let num = 0;
      let arr = [];
     data.forEach((item)=>{
         if(num==6){
             num = 0;
             dataArr.push(arr);
             arr = [];
         }
         arr.push(item);
         num++;
     })
     dataArr.push(arr);
  }
  chai(datas);
 
  await ctx.render('admin/admin',{
    datas:dataArr,
    HTTP_ROOT,
    msg:msg
   
  });
});
router.get('/banner/solve',async ctx=>{
    let datas =  await ctx.db.query(`SELECT * FROM admin_table`);
    let {HTTP_ROOT} = ctx.config;
    let arr = [];
    let dataArr = [];
    datas.forEach((item)=>{
        if(item.stateA=='已解决'){
            arr.push(item);
        }

    })
    function chai(data){
        let num = 0;
        let arr = [];
       data.forEach((item)=>{
           if(num==6){
               num = 0;
               dataArr.push(arr);
               arr = [];
           }
           arr.push(item);
           num++;
       })
       dataArr.push(arr);
    }
    chai(arr);
    let msg = 'solve';
    await ctx.render('admin/admin',{
        datas:dataArr,
        HTTP_ROOT,
        msg:msg
      });
   
})
router.get('/banner/unhandle',async ctx=>{
    let datas =  await ctx.db.query(`SELECT * FROM admin_table`);
    let {HTTP_ROOT} = ctx.config;
    let arr = [];
    let dataArr = [];
    datas.forEach((item)=>{
        if(item.stateA=='未解决'){
            arr.push(item);
        }

    })
    function chai(data){
        let num = 0;
        let arr = [];
       data.forEach((item)=>{
           if(num==6){
               num = 0;
               dataArr.push(arr);
               arr = [];
           }
           arr.push(item);
           num++;
       })
       dataArr.push(arr);
    }
    chai(arr);
    let msg = 'unhandle'
    await ctx.render('admin/admin',{
        datas:dataArr,
        HTTP_ROOT,
        msg:msg
       
      });
})
router.get('/banner/my',async ctx=>{
    let {HTTP_ROOT} = ctx.config;
    let msg = 'my';
    await ctx.render('admin/myadmin',{
        HTTP_ROOT,
        msg:msg
    })
})
router.all('/change/solve',async ctx=>{
   let {num} = ctx.query;
    
 try{
    await ctx.db.query(`UPDATE  admin_table  SET stateA='已解决' WHERE  onA=${num}`);
   
    ctx.body = '成功';
  }catch(e){

    ctx.body = '失败';
  }
   
   
})
router.all('/change/fail',async ctx=>{
    let {num} = ctx.query;
    
  try{
     await ctx.db.query(`UPDATE  admin_table  SET stateA='无法解决' WHERE  onA=${num}`);
     ctx.body = '成功';
   }catch(e){
     ctx.body = '失败';
   }
    
    
 })
router.get('/banner/pj',async ctx=>{
    let {HTTP_ROOT} = ctx.config;
    let datas =  await ctx.db.query(`SELECT * FROM msg_table`);
    let dataArr = [];
    function chai(data){
        let num = 0;
        let arr = [];
       data.forEach((item)=>{
           if(num==6){
               num = 0;
               dataArr.push(arr);
               arr = [];
           }
           arr.push(item);
           num++;
       })
       dataArr.push(arr);
    }
    chai(datas);
    
    await ctx.render('admin/pj',{
        HTTP_ROOT,
        datas:dataArr,
        msg:'pj'
    })
})

module.exports = router.routes();
