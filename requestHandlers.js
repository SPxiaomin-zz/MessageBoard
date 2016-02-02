var util = require('util');
var url = require('url');
var querystring = require('querystring');
var moment = require('moment');

var db = require('./db');

function save(req, res) {
    var str = '';

    req.on('data', function(chunk) {
        str += decodeURIComponent(chunk);
    });

    req.on('end', function(chunk) {
        var data = {};
        var parameter = querystring.parse(str);
        var now = moment().format('YYYY-MM-DD HH:mm:ss');

        data.author = parameter.author;
        data.msg= parameter.msg;
        data.dtime = now;

        db.save(data, function(result) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(util.format('%j', result));
            res.end()
        });
    });
}

function list(req, res) {
    var parameter = url.parse(req.url, true).query;

    db.list(parameter.page, function(result) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(util.format('%j', result));
        res.end();
    });
}

exports.save = save;
exports.list = list;
