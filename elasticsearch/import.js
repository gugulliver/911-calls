var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

const calls = [];


// Création de l'indice
esClient.indices.create({ index: '911call' }, (err, resp) => {
  if (err) console.trace(err.message);

//lat,lng,desc,zip,title,timeStamp,twp,addr,e
fs.createReadStream('../911.csv')
    .pipe(csv())
    .on('data', data => {
      calls.push({
	location: { lat: parseFloat(data.lat),lon: parseFloat(data.lng)},
        desc: data.desc,
        zip: data.zip,
        title: data.title,
        timeStamp: new Date(data.timeStamp),
        twp: data.twp,
        addr: data.addr,
        e: data.e
    });
      // TODO extract one line from CSV
    })
    .on('end', () => {
      // TODO insert data to ES
      esClient.bulk(createBulkInsertQuery(calls), (err, resp) => {
        if (err) console.trace(err.message);
        else console.log(`Inserted ${resp.items.length} calls`);
        esClient.close();
      });
    });
});




function createBulkInsertQuery(call) {
  const body = calls.reduce((acc, call) => {
        const { location,desc,zip,title,timeStamp,twp,addr,e } = call;
        acc.push({ index: { _index: '911call', _type: 'call'} })
        acc.push({ location,desc,zip,title,timeStamp,twp,addr,e })
        return acc
      }, []);
    
      return { body };
}

    /*


        })
        // A la fin on créé l'ensemble des acteurs dans MongoDB
        .on('end', () => {
            collection.insertMany(actors, (err, result) => {
                callback(result);
            });

    */
