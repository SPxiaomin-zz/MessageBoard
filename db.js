var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/msgBoard';
var documentName = 'msg';

function save(data, callback) {
    MongoClient.connect(url, function(err, db) {
        if ( err ) {
            console.log(err);
        } else {
            var collection = db.collection(documentName);

            collection.insert(data, function(err, result) {
                if ( err ) {
                    console.log(err);
                } else {
                    console.log('insert success!!');
                    callback && callback(result);
                    db.close();
                }
            });
        }
    });
}

function list(page, callback) {
    var pageNum = 15;
    var skipNum = (page - 1) * pageNum;

    MongoClient.connect(url, function(err, db) {
        if ( err ) {
            console.log(err);
        } else {
            var collection = db.collection(documentName);

            collection.find({}).skip(skipNum).limit(pageNum).sort({dtime: -1}).toArray(function(err, result) {
                if ( err ) {
                    console.log(err);
                } else {
                    callback && callback(result);
                    db.close();
                }
            });
        }
    });
}

exports.save = save;
exports.list = list;
