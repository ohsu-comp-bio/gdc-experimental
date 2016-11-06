#!/bin/bash

# setup our default index mapping
curl -XPUT 'localhost:9200/_template/template_1?pretty' -d'
{
  "order":0,
  "template":"*",
  "mappings":{
    "_default_":{
      "dynamic_templates":[
        {
          "strings_as_text":{
            "match_mapping_type":"string",
            "match_pattern": "regex",
            "match":".*diagnosis|.*description|.*comment",
            "mapping":{
              "type":"text",
              "fields": {
                "raw": {
                  "type":  "keyword",
                  "ignore_above": 256
                }
              }
            }
          }
        },
        {
          "strings_as_keywords":{
            "match_mapping_type":"string",
            "mapping":{
              "type":"keyword"
            }
          }
        }
      ]
    }
  }
}
'
