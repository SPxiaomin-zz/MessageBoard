var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(req, res) {
        var pathname = url.parse(req.url).pathname;

        route(handle, pathname, req, res);
    }

    http.createServer(onRequest).listen(8000);
    console.log('Server Started on Port 8000');
}

exports.start = start;
