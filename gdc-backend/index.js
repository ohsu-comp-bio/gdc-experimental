var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var jsf = require('json-schema-faker');
console.log(jsf.version);


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.post('/faker', function(request, response) {
  var schema = request.body;
  var sample = jsf(schema);
  response.send(sample);
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
