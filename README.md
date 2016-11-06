# gdc-experimental
An exploration of the gdc api.

A very preliminary implementation of the api described at:

* https://gdc-docs.nci.nih.gov/API/Users_Guide/Getting_Started/#api-endpoints

Leverages:

* gdc data dictionary  https://github.com/NCI-GDC/gdcdictionary
* ccc data dictionary https://github.com/ohsu-computational-biology/gdc-experimental/tree/api2/schemas

Includes:

* ui - search, projections, sort
* api - the GDC inspired api
* backends - both elastic and mongo
* authentication - jwt and developer login
* faker - randomized data based on schemas


## Setup
```
# create an .env file for your environment
$ cat .env
# API configuration
UI_PORT=80
ELASTIC_HOST=elastic
ELASTIC_PORT=9200
API_PORT=8000
API_DEBUG=1
API_HOST=0.0.0.0
API_URL=http://api:8000
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
 Name                Command               State                Ports
-----------------------------------------------------------------------------------
api       /bin/sh -c python run.py         Up      0.0.0.0:8000->8000/tcp
elastic   /docker-entrypoint.sh elas ...   Up      0.0.0.0:9200->9200/tcp, 9300/tcp
faker     /bin/sh -c supervisor index.js   Up      0.0.0.0:5000->5000/tcp
mongo     /entrypoint.sh mongod            Up      0.0.0.0:27017->27017/tcp
ui        npm start                        Up      0.0.0.0:80->3000/tcp

# load mongo
# note: the /util directory is mounted from the project directory
# note: note download aggregated_resource.json from box into ./util directory
# https://ohsu.box.com/s/hfundkfab9ba202ujp3b415iq5i704x2
$ docker exec -it mongo bash
$ cd /util
$ cat aggregated_resource.json | mongoimport  --db test --collection aggregated_resource

# validate that mongo loaded data
$ mongo  test -eval 'db.aggregated_resource.count()'
MongoDB shell version: 3.2.10
connecting to: test
25340

# load elastic search
# note: the /util directory is mounted from the project directory
# note: note download aggregated_resource.json from box into ./util directory
# https://ohsu.box.com/s/hfundkfab9ba202ujp3b415iq5i704x2
$ docker exec -it elastic bash
$ cd /util
$ ./es-default-mapping.sh
$ ./es-load.sh
$ curl localhost:9200/_cat/indices?v
health status index                    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   test-aggregated-resource PVBAjbvwRl-n3Zt4UWQ7xg   5   1      25340            0     41.2mb         41.2mb

```

Now that the setup is complete,

## Usage
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

## UI

Simple search, with projections

### user search
![image](https://cloud.githubusercontent.com/assets/47808/20025679/0064d12c-a2ae-11e6-8429-421bbf90d089.png)


#### Note:  the search interfaces are not equivalent.   

See [here](doc/query_tests.md) for more.


## Resulting queries
### ES
```
$ curl $GDC_API'/v0/files?filters=%27BAML%27%20AND%20%27AML-14-00175%27&fields=_id,%20sampleId,%20url&page=1' | jq .data.hits[]._id

"2189ed1d-16a9-4df6-a9d5-3064071eb463"
"24b7623a-c390-4564-81b3-b04aa355b965"
"d10f6b6b-d2fd-435d-9623-2e8542d40527"
"348444c0-8a0c-4d36-9f77-37fd93494aec"
"268a97ee-f4ed-48c7-ae57-14180d626c04"
"4b221a03-152d-4b64-a45a-f4fbdfc5b631"
"923a5fa6-dc84-49fd-9d53-be2e7e4ef672"
"6aa7af7b-9281-4c15-87be-75fd6895455c"
"8ead890d-8bf3-48d0-a0a9-138c321ffed2"
"bd5f743a-3921-4436-91d8-2f9888b16700"
```

### Mongo
Note: The `v0-mongo` has been deprecated for now.  This example was left to show that the mongo & elastic endpoints return the same formatted data compliant with GDC
```
$ curl -g $GDC_API'/v0-mongo/files?filters={%22$and%22:[{%22projectCode%22:%22BAML%22},{%22sampleId%22:%22AML-14-00175%22}]}&fields={%22_id%22:1,%22sampleId%22:1,%22url%22:1}&page=1' | jq .data.hits[]._id

"e61df931-c4e5-4d3f-9ac0-38a26ef6cce7"
"a3ee7d82-f357-4083-af78-14180b6edec4"
"0f6f62b5-b1d9-4880-b2f2-61d2a0bf3783"
"be9d48cc-e0eb-4c4c-8aae-04d0319a1747"
"c58235e7-2e2f-4c3b-b56b-db5beae73311"
"1a9e19c6-97b7-43ac-970a-68d8085b8b20"
"a1e9102f-ea8e-44f2-949d-a6256440b9b5"
"d28352b6-6a3c-4055-b412-23dd694addca"
"eb3e6a6a-705e-4e82-9f21-1b4b8ab60a70"
"a2277527-7a2b-4689-b6f2-75a1ee968d1a"
```


## Testing
Is very preliminary at this time.

The tests that do exist are integration tests,
that is they test the API with the backends, no mocks exists.
Therefore, real databases need to exist and the server
needs to be able to connect to them.

No ui tests exist, for now.


```
# for some reason, this needs to be set in order to
# for eve to run ( gets config not found otherwise )
$ export EVE_SETTINGS=$(pwd)/settings.py

# then start tests
$ py.test
platform linux2 -- Python 2.7.11, pytest-3.0.3, py-1.4.31, pluggy-0.4.0
rootdir: /service, inifile: pytest.ini
plugins: flask-0.10.0
collected 6 items

tests/integration/api_tests.py ......
6 passed in 0.17 seconds

```

## Roadmap

Short term tasks

  * more tests ( CRUD, validation )

  * import the oicr/dcc file repository index for a larger, more representative sample

  * ccc_client support

  * updating elastic index [transaction || pipe || batch]

  * summaries: return query summary stats for chart rendering  

  * implement other endpoints /v0/projects /v0/cases ... use mongo for CRUD, elastic for search

  * use nginx for ssl termination and proxy routing, as opposed to currently using the ui development server

  * if ccc-ldap-authentication continues to be months away, consider other authentication sources, perhaps https://pythonhosted.org/Flask-GoogleLogin/


Tactical alternatives:

  * reduce the amount of jwt code, perhaps by using [eve-auth-jwt](https://github.com/rs/eve-auth-jwt)

  * consider using [docker compose extends](https://docs.docker.com/compose/extends/) instead of or in addition to .env to manage dev v test v prod and exacloud v sparkdmz.

  * reduce the infrastructure needed for testing, perhaps by using [eve-mocker](https://github.com/tsileo/eve-mocker) and [vcrpy](https://github.com/kevin1024/vcrpy)
