# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

```
utilitaire:

GET 911call/

DELETE /911call

PUT 911call
{
  "mappings": {
    "call": {
      "properties": {
        "location": {
          "type": "geo_point"
        },
        "desc": {"type": "text"},
        "zip": {"type": "integer"},
        "title": {"type": "text"},
        "timeStamp": {"type": "date"},
        "twp": {"type": "text"},
        "addr": {"type": "text"},
        "e": {"type": "text"}
      }
    }
  }
}


qu1 :

GET /911call/call/_count
{
    "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
      "filter": {
        "geo_distance": {
         "distance" : "0.5km",
            "location" : {
              "lat" : 40.241493,
              "lon" : -75.283783
          }
        }
      }
    }
  }
}

res :
{
  "count" : 717,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  }
}




qu2 :

POST /911call/call/_count
{
    "query": {
        "match": {
           "title": "EMS"
        }
    }
}
POST /911call/call/_count
{
    "query": {
        "match": {
           "title": "Traffic"
        }
    }
}

POST /911call/call/_count
{
    "query": {
        "match": {
           "title": "Fire "
        }
    }
}

res :
{
  "count" : 75591,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  }
}

{
  "count" : 54549,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  }
}

{
  "count" : 24426,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  }
}




qu 3:

POST /911call/call/_search
{
    "size": 0,
     "aggs" : {
         "call" : {
            "date_histogram": {
                "field": "timeStamp",
                "interval": "1M",
                "time_zone": "Europe/Berlin",
                "order" : { "_count" : "desc" }
            }
        }
    }
}

res :

{
  "took" : 85,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 153195,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "call" : {
      "buckets" : [
        {
          "key_as_string" : "2016-01-01T00:00:00.000+01:00",
          "key" : 1451602800000,
          "doc_count" : 13096
        },
        {
          "key_as_string" : "2016-10-01T00:00:00.000+02:00",
          "key" : 1475272800000,
          "doc_count" : 12502
        },
        {
          "key_as_string" : "2016-12-01T00:00:00.000+01:00",
          "key" : 1480546800000,
          "doc_count" : 12162
        },



qu 4:

GET /911call/call/_search
{
  "size" : 0, 
  "query": { 
    "bool": {
      "must": [
        { "match": { "title": "overdose" }}
      ]
    }
  },
  "aggs": {
    "twp": {
      "terms": {
        "field":   "twp.keyword",      
        "order": { "_count": "desc" } 
      }
    }
  }
}


res :
{
  "took" : 105,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 1948,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "twp" : {
      "doc_count_error_upper_bound" : 22,
      "sum_other_doc_count" : 929,
      "buckets" : [
        {
          "key" : "POTTSTOWN",
          "doc_count" : 203
        },
        {
          "key" : "NORRISTOWN",
          "doc_count" : 180
        },
        {
          "key" : "UPPER MORELAND",
          "doc_count" : 110
        },

```

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```
