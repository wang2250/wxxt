//请求static资源

const static = require('koa-static');
module.exports = function(router,options){
    options = options||{};
    options.img = options.img||20;
    options.css = options.css||30;
    options.js = options.js||1;
    options.html = options.html||20;
    options.other = options.other||7;

    router.all(/(\.jpg|\.png|\.jpeg)$/,static('./static/img',{
        
    }));
    router.all(/(\.css)$/,static('./static/css',{
        maxAge:0
    }));
    router.all(/(\.js)$/,static('./static/js',{
        
    }));
    router.all(/(\.html)$/,static('./static/html',{
        
    }));
    router.all('*',static('./static',{
        
    }));
}