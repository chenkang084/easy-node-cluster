const app = require("express")();
app.get("/", function(req, res) {
  console.log(process.pid);

  process.exit();

  res.send("process " + process.pid + " says hello!").end();
});

const server = app.listen(8000, function() {
  console.log(
    "Process " + process.pid + " is listening to all incoming requests"
  );
});
