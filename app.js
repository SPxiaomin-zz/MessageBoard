var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle['/save'] = requestHandlers.save;
handle['/list'] = requestHandlers.list;

server.start(router.route, handle);
