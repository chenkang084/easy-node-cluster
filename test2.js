// const fs = require('fs');
// const arr = [];

// for (let i = 0; i < 5; i++) {
//   const buffer1 = fs.readFileSync(
//     '/Users/kangchen/Downloads/[电影天堂www.dy2018.com]dd毒液BD中英双字.mp4'
//   );

//   arr.push(buffer1);

//   function test() {
//     console.log(buffer1);
//   }

//   console.log(process.memoryUsage().rss / 1024 / 1024);
// }

// // console.log(process.memoryUsage().rss / 1024 / 1024);
// setTimeout(() => {
//   console.log(arr.length);
// }, 100000);

'use strict';
const express = require('express');
const app = express();

//以下是产生泄漏的代码
let theThing = null;
let replaceThing = function() {
  let leak = theThing;
  let unused = function() {
    if (leak) console.log('hi');
  };

  // 不断修改theThing的引用
  theThing = {
    longStr: new Array(1000000),
    someMethod: function() {
      console.log('a');
    }
  };
};

app.get('/leak', function closureLeak(req, res, next) {
  for (let i = 0; i < 200; i++) {
    replaceThing();

    console.log(process.memoryUsage().rss / 1024 / 1024, i);
  }

  res.send('Hello Node');
});

app.listen(8000);
