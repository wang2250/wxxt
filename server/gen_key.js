const fs = require('fs');

const KEY_LEN = 1024;
const KEY_COUNT = 2048;
const CHARS = 'qwwertyuiioplkajdhgzvxbvm74r27425930';
let arr = [];
for(let i = 0;i<KEY_LEN;i++){
   let key = '';
   for(let j= 0;j<KEY_COUNT;j++){
       key+=CHARS[Math.floor(Math.random()*CHARS.length)];
   }

   arr.push(key);
}

fs.writeFileSync('.keys',arr.join('\n'));
