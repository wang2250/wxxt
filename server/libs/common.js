//常用的东西

//无法反向解密   简单的密码可以撞库撞出来  散列算法  都是单向的
//sha
const crypto = require('crypto');//专门做加密解密

module.exports = {
    md5(buffer){
        let obj = crypto.createHash('md5')//创建一个新的三列对象 
        obj.update(buffer);
        return obj.digest('hex');//要16进制     
    }
}