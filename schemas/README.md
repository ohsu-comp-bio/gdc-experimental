# Schemas

This directory contains:

* The protocol buffer schemas
* A utility to read the schemas and produce different output (jsonschema and cerebus)

## Data flow
Before we get to far into the weeds regarding the schemas, let's review the dataflow.
![image](https://cloud.githubusercontent.com/assets/47808/19786287/10114144-9c52-11e6-900c-27d681fd5646.png)


## Schemas
The schemas are based on the GA4GH metadata, plus an addition to support resources (files, api, etc.)
![image](https://cloud.githubusercontent.com/assets/47808/19786371/76c41f9c-9c52-11e6-9cf5-a861bf2ba1e9.png)

## Utilty
The cannonical schemas are maintained in protobuf.  The `bin/custom-plugin.py` processes the schemas for alternate uses.
![image](https://cloud.githubusercontent.com/assets/47808/19787247/a21d16fe-9c56-11e6-9f2e-523c43653607.png)

## cccschema
The schemas are packaged into a python module `cccschema`
