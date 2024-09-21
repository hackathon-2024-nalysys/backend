```
npm install
docker compose up -d
npm run start:dev
```

```
open http://localhost:3000
```


## Elasticsearch インデックス作成

```
PUT /hackathon-hobbies
{
  "mappings": {
    "properties": {
      "embeddings": {
        "type": "dense_vector",
        "dims": 768,
        "index": true,
        "similarity": "cosine"
      },
      "name" : {
        "type" : "keyword"
      }
    }
  }
}
```