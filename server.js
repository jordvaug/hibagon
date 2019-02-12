var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hibagon here!');
});

app.post('/oauth', function(req, res){

    res.send('HTTP 200 OK\n' +
        'Content-type: text/plain\n' +
        'xoxp-263671042533-263584606484-547032804933-1b8d556eb89dd2d44e291ef6b072f323');
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});