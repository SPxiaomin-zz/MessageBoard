var fs = require('fs');
var path = require('path');
var mime = require('./mime').types;

function route(handle, pathname, req, res) {
    console.log('About to route a request for ' + pathname);
    if ( typeof handle[pathname] === 'function' ) {
        handle[pathname](req, res);
    } else {
        var realPath = 'public' + pathname;
        var ext = path.extname(realPath);
        
        ext = ext ? ext.slice(1) : 'unknown';
        var contentType = mime[ext] || 'text/plain';

        fs.access(realPath, function(err) {
            if ( err ) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('This request URL ' + pathname + ' was not found on this server.');
                res.end();
            } else {
                fs.readFile(realPath, 'binary', function(err, file) {
                    if ( err ) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.write(err);
                        res.end();
                    } else {
                        res.writeHead(200, {
                            'Content-Type': contentType
                        });
                        res.write(file, 'binary');
                        res.end();
                    }
                });
            }
        });
    }
}

exports.route = route;
