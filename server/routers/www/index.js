const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const common = require('../../libs/common');
const static = require('koa-static');
let router = new Router();

 router.get('',async ctx=>{
    
     let {HTTP_ROOT} = ctx.config;
     let data = await ctx.db.query(`SELECT * FROM admin_table`);
     let number = data.length;
 
     data.reverse();
         await ctx.render('admin/index',{
        HTTP_ROOT,
        data:data,
        number:number
    });
 });

router.all('found',async ctx=>{
   
let {content} = ctx.query;
let {HTTP_ROOT} = ctx.config;
try{
    let state =   await ctx.db.query(` SELECT * FROM  admin_table  WHERE onA=${content}`);
    state = state[0];

   await ctx.render('admin/zt',{
     data:state,
     HTTP_ROOT,
      ret:'yh'
    })

}catch(e){
   ctx.body = '未找到数据';
}
 
 
  
  
});
router.get('cuidan',async ctx=>{
    let {num} = ctx.query;
    try{
        await ctx.db.query(`UPDATE  admin_table  SET cd='催单' WHERE  onA=${num}`);
        ctx.body = '成功';
      }catch(e){
        ctx.body = '失败';
      }
})
router.get('msg:id',async ctx=>{
 try{
    let {txt} = ctx.query;
    let {id} = ctx.params;
        id = id.slice(1);
    let datas =  await ctx.db.query(`SELECT * FROM admin_table WHERE onA=${id}`);
        datas = datas[0];
    await ctx.db.query(`INSERT INTO msg_table (name,content,onA,adr) VALUES(?,?,?,?)`,[datas.name,txt,id,datas.address]);
    await ctx.db.query(`UPDATE  admin_table  SET mssg='true' WHERE  onA=${id}`);
    ctx.body = '评价成功！感谢您的支持';
 }catch(e){
     console.log(e)
     ctx.body = "评价失败！"
 }

})
module.exports = router.routes();
