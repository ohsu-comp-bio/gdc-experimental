
#!/bin/bash

# load elastic dump output into mongo
if [ -z "$1" ]
then
  echo usage: es-to-mongo [full-path-of-elastic-dump.json]
  exit 1
fi
cat $1 | ./es-to-mongo.py | mongoimport  --db test --collection aggregated_resource
