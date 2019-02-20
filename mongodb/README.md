# 911 Calls avec MongoDB

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
use 911-calls
db.calls.count()
```

## Index géographique et index textuel

Afin de répondre aux différents problèmes, vous allez avoir besoin de créer deux index particuliers sur la collection des appels :

* Un index géographique de type `2dsphere` pour les coordonnées GPS des appels.
  * https://docs.mongodb.com/manual/core/2dsphere/#create-a-2dsphere-index
* Un index textuel sur le titre des appels pour pouvoir faire des recherches full-text sur ce champ (recherche des overdoses par exemple)
  * https://docs.mongodb.com/manual/core/index-text/#create-text-index

## Requêtes

À vous de jouer ! Écrivez les requêtes MongoDB permettant de résoudre les problèmes posés.

```

? 
db.calls.createIndex( {coordinates: "2dsphere" } )
db.calls.drop()
db.calls.findOne()
db.calls.explain()
show dbs


db.calls.find({ 
   coordinates :{
    $near : {
       $geometry : {   
          index : "Point" ,
          coordinates : [-75.283783, 40.241493 ]
         },
      $maxDistance : 500
     }
   }
 }).count()
717





db.calls.aggregate([
    { 
      $group: {
        _id: "$category",
        count: { $sum: 1 } 
      }
    }
])
db.calls.aggregate([
    { 
      $group: {
        title: "EMS",
        count: { $sum: 1 } 
      }
    }
])


db.calls.aggregate([
        {
            $match: {
                "title": 
                {
                    $regex:
                        ".*OVERDOSE.*"  
                }
            }
        },
        {
            $group: {
                _id: "$twp",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                 "count": -1
            }
        
        },
        {
            $limit : 3
        }
    ])
	
    re:
{ "_id" : "POTTSTOWN", "count" : 203 }
{ "_id" : "NORRISTOWN", "count" : 180 }
{ "_id" : "UPPER MORELAND", "count" : 110 }

	
	
	db.calls.aggregate([
        {
            $group : {
                _id : {
                    month: {
                       $month: "$timeStamp" 
                    },
                    year: {
                        $year: "$timeStamp"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 3
        }
    ])
    
{ "_id" : "1/2016", "count" : 13084 }
{ "_id" : "10/2016", "count" : 12502 }
{ "_id" : "12/2016", "count" : 12162 }


//timeStamp
    ```

Vous allez sûrement avoir besoin de vous inspirer des points suivants de la documentation :

* Proximity search : https://docs.mongodb.com/manual/tutorial/query-a-2dsphere-index/#proximity-to-a-geojson-point
* Text search : https://docs.mongodb.com/manual/text-search/#text-operator
* Aggregation Pipeline : https://docs.mongodb.com/manual/core/aggregation-pipeline/
* Aggregation Operators : https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
