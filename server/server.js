const Koa = require('koa');
const Router = require('koa-router');
const static = require('./routers/static');
const body = require('koa-better-body');//解析post请求的中间件 上传
const path = require('path');//能用绝对路径就不用相对路径
const session = require("koa-session");
const fs = require('fs');
const ejs = require('koa-ejs');
const config = require('./config');


let server = new Koa();
server.listen(config.HTTP_PORT);
console.log(`server run st ${config.HTTP_PORT}`)

//中间件  START
server.use(body({
    uploadDir:path.resolve(__dirname,'./static/upload/')
}))

server.keys = fs.readFileSync('.keys').toString().split('/n');
server.use(session({
    maxAge:20*60*10000,
    renew:true,//自动续期
},server));
//中间件 END



//数据库模块  START
server.context.db = require('./libs/database');
//数据库  END

server.context.config = config;


//渲染  START
ejs(server,{
    root:path.resolve(__dirname,'template'),
    layout:false,
    viewExt:'ejs',
    cache:false,
    debug:false
})
//渲染  END

 
//路由和static  START
let router = new Router();
//统一处理错误
 router.use(async (ctx,next)=>{
    try{
       await next();
       
   }catch(e){
    //    ctx.state = 500;
    //    ctx.body = 'Internal server error';
    console.log(e)
    ctx.throw(500,'Internal server error')
    
   }
 })
router.use('/admin',require('./routers/admin'));
router.use('/', require('./routers/www'));
static(router);//只要是文件结尾
server.use(router.routes());
//路由和static  END