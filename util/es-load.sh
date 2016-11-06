#!/bin/bash

# load elastic dump output into elastic
cat aggregated_resource.json | \
  jq -c '. | {"index": {"_index": "test-aggregated-resource", "_type": "aggregated_resource", "_id": ._id}}, del(._id)' | \
  curl -XPOST localhost:9200/_bulk --data-binary @- > /dev/null
curl localhost:9200/_cat/indices?v
