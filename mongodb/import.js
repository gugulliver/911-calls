var mongodb = require('mongodb');
var csv = require('csv-parser');
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/911-calls';

var insertCalls = function(db, callback) {
    var collection = db.collection('calls');

    var calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {       
            var call = {
              coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
              desc: data.desc,
              zip: data.zip,
              title: data.title,
              timeStamp: new Date(data.timeStamp),
              twp: data.twp,
              addr: data.addr
            }; // TODO créer l'objet call à partir de la ligne

            calls.push(call);
        })
        .on('end', () => {
          collection.insertMany(calls, (err, result) => {
            callback(result)
          });
        });
}

MongoClient.connect(mongoUrl, (err, db) => {
    insertCalls(db, result => {
        console.log(`${result.insertedCount} calls inserted`);
        db.close();
    });
});
