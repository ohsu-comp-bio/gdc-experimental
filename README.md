# gdc-experimental
An exploration of the gdc api.

A very preliminary implementation of the api described at
https://gdc-docs.nci.nih.gov/API/Users_Guide/Getting_Started/#api-endpoints

Leverages the gdc data dictionary
https://github.com/NCI-GDC/gdcdictionary


## setup
```
# create an .env file for your environment
$ cat .env
# API configuration
ELASTIC_HOST=192.168.99.100
ELASTIC_PORT=9200
API_PORT=8000
API_DEBUG=1
API_HOST=0.0.0.0
FAKER_URL=http://faker:5000/faker
FAKER_PORT=5000
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_DBNAME=test
MONGO_USERNAME=
MONGO_PASSWORD=

# verify you have docker-compose installed
$ docker-compose -v
docker-compose version 1.8.1, build 878cff1

# start docker
$ docker-compose up

# verify docker containers started
$ docker-compose ps
Name               Command               State            Ports
-------------------------------------------------------------------------
api     /bin/sh -c python run.py         Up      0.0.0.0:8000->8000/tcp
faker   /bin/sh -c supervisor index.js   Up      0.0.0.0:5000->5000/tcp
mongo   /entrypoint.sh mongod            Up      0.0.0.0:27017->27017/tcp

# load mongo
# note: the /util directory is mounted from the project directory
# note: note download aggregated_resource.json from box
$ docker exec -it mongo bash
/# cd /util
/# cat aggregated_resource.json | mongoimport  --db test --collection aggregated_resource

# validate that mongo loaded data
/# mongo  test -eval 'db.aggregated_resource.count()'
MongoDB shell version: 3.2.10
connecting to: test
25340

# load elastic search
# note: the /util directory is mounted from the project directory
# note: note download aggregated_resource.json from box
$ docker exec -it elastic bash
/# cd /util
/# ./load-es.sh
# curl localhost:9200/_cat/indices
yellow open test-aggregated-resource 5 1 25340 0 19.4mb 19.4mb

```

## usage
For example:

```
# set to your host
$ export GDC_API=http://192.168.99.100:8000

# exercise the api
# note some examples use the `jq` utility to format output

$ curl $GDC_API/v0/status
{
  "status": "OK",
  "commit": "snapshot",
  "tag": "1.4.0",
  "version": 1,
  "user": "Anonymous"
}


# note that faker responds with random data.
# including random empty records, your values will change
curl $GDC_API/v0/projects  | jq .
[
  {
    "name": "cupidatat incididunt in nostrud reprehenderit",
    "info": {},
    "description": "proident"
  }
]


# pass a canned token, extract identity

curl $GDC_API/v0/status  -H "Authorization: Bearer eyJBQ0NFU1NfVE9LRU4iOiJleUpoYkdjaU9pSlNVekkxTmlKOS5leUpsZUhBaU9qRTFNRGcyTURjME1UTXNJbUYxWkNJNkltUXpZMkZtTVRVeUxUUXhPRGd0TkdNeE9TMDVOVFEzTFRBd01UTmxOelkwTmpFeVpDSXNJbWx6Y3lJNkltaDBkSEE2WEM5Y0x6RTVNaTR4TmpndU1TNHlNelk2T0RBNE5Gd3ZiM0JsYm1sa0xXTnZibTVsWTNRdGMyVnlkbVZ5TFhkbFltRndjRnd2SWl3aWFuUnBJam9pTkRObFpHTTVaalV0WkRRd05TMDBNMlE0TFdKaU56Z3ROakUwWkdRMU16RmlabVl3SWl3aWFXRjBJam94TkRjM01EY3hOREV6ZlEuSXdDYUI1eUhZbTdRR2JLa0kyOC1XT2JWa3ptUUdyVHdxSms0SHFkUzJLaVg1UHdFRW1Zdk9xY1NwbFZjQUhoWGlqNzJ3ekdDLWh6dzliUXRMY2lkMlZmRTVLLVA0TzhHcmhhaUVSTXBvXzZWN0p4MU40SXRqNzdzYXZNTVhFc2d0aGk0UG1hajlTMUhSZk9lVkN5V1JCYUFOT1QtOHV6YzdKVkpVbDNOTTh4anZTVHBRV1JuMF9wLUhqVEJpQ0JkRm9xaXRFbWUtM3NobXotX05uTThkcENhZlhrMVdaRmFQZjJuSjItR1JDZm9oeW5IMlU2Q1Z5M0w5VWRXTTJpcndQM3NYSTROV19HUl9HNVVMeDE1ODNMTHF4dzdaRU5HOTEwTGQzTGRUeU5MU3VHRW1pakRuMk1Eb0xiU2FnVUVMMl9jQzlzZ2hCT0pZb3M1cXIxbnJRIiwiSURfVE9LRU4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0ltdHBaQ0k2SW5KellURWlmUS5leUpsZUhBaU9qRTFNRGcyTURjME1UTXNJbk4xWWlJNkltSnNZeUlzSW01dmJtTmxJam9pT1dNeE1UZzVZVEJrTkRZM0lpd2libUZ0WlNJNkltSnNZeUlzSW1GMVpDSTZJbVF6WTJGbU1UVXlMVFF4T0RndE5HTXhPUzA1TlRRM0xUQXdNVE5sTnpZME5qRXlaQ0lzSW1semN5STZJbWgwZEhBNlhDOWNMekU1TWk0eE5qZ3VNUzR5TXpZNk9EQTRORnd2YjNCbGJtbGtMV052Ym01bFkzUXRjMlZ5ZG1WeUxYZGxZbUZ3Y0Z3dklpd2lhV0YwSWpveE5EYzNNRGN4TkRFekxDSnZjbWRoYm1sNllYUnBiMjVmYm1GdFpTSTZJa2x1ZEdWc0lpd2lhMmxrSWpvaWNuTmhNU0o5Lm9DX1hNR2RYdmdLN0o2eVRZcWNyYng5alZIQzFUZ0M5RnlSd3Ntd285OElhd0ZGU2U5aGtjMjVydVR6Y2pRT1RRM3JuNUF1MnNKMVZjcjM3ZXc3dUtweUlIb3Izb1dvUDF6QmNzc0xSQjJnRWxhYjZHT1V4YVJsdDJDVFVpSGk0Q19reWdxMThZYlVmUzBMWVhrYmJsaUgyVm9CWEFOLUN5Q2VvS1NuaEFsWjNUMGV3ZTlra2dYcVBQRVNsRi1yZWFhUmFOMG5TMHNsLUZhSXBab2VLZnBKRWhmMl9FcHEzLW5NUFRxV1Z4Zmw5N3dJbTQzQk9uMk1kOFR1cDhwSURmcnJuemRjOU1LNWM5c1dJelpfZjdScXlxanhRa0VsU2ZxTmx0dHhtX09hSjhuUlpscTFHZGpVb1lFY3FSY1NyTEJ0VWtDSDh6NUhDbG1yZDhnOFFMZyIsIlJFRlJFU0hfVE9LRU4iOiJleUpoYkdjaU9pSnViMjVsSW4wLmV5SnFkR2tpT2lJeU9HRTBabVV5TmkxaFpHRTFMVFExWXprdFlXVmpZeTFrWmpZME1tSTJabU5tWW1NaWZRLiJ9"
{
  "commit": "snapshot",
  "status": "OK",
  "tag": "1.4.0",
  "user": "blc.Intel",
  "version": 1
}

# verify that either backend returns equivalent data
# query the endpoint (ES)
curl $GDC_API/v0/files | jq .data.hits[0]._id
"0044f587-b617-4375-bd88-bfee80a4742f"

# query the endpoint (MONGO)
curl $GDC_API/v0-mongo/files | jq .data.hits[0]._id
"0044f587-b617-4375-bd88-bfee80a4742f"




```
