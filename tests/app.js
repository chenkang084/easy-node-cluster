const app = require("express")();

//以下是产生泄漏的代码
let theThing = null;
let replaceThing = function() {
  let leak = theThing;
  let unused = function() {
    if (leak) console.log("hi");
  };

  // 不断修改theThing的引用
  theThing = {
    longStr: new Array(1000000),
    someMethod: function() {
      console.log("a");
    }
  };
};

app.get("/", function(req, res) {
  console.log(process.pid, process.env.NODE_APP_INSTANCE);

  res
    .send(
      "process " +
        process.pid +
        " says11 hello!" +
        process.env.NODE_APP_INSTANCE
    )
    .end();
});

app.get("/shutdown", function(req, res) {
  process.exit();

  res.send("process " + process.pid + " says hello!").end();
});

app.get("/leak", function closureLeak(req, res, next) {
  for (let i = 0; i < 200; i++) {
    replaceThing();
  }

  res.send("Hello Node" + process.pid);
});

app.listen(8000, function() {
  console.log(
    "Process " + process.pid + " is listening to all incoming requests"
  );
});
