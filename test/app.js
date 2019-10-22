const app = require('express')();
app.get('/', function(req, res) {
  console.log(process.pid);

  res.send('process ' + process.pid + ' says hello!').end();
});

app.get('/shutdown', function(req, res) {
  process.exit();

  res.send('process ' + process.pid + ' says hello!').end();
});

app.listen(8000, function() {
  console.log(
    'Process ' + process.pid + ' is listening to all incoming requests'
  );

  process.send('started');
});
