#!/bin/bash
# use protoc to create jsonschema friendly

# since we cannot pass flags to our plugin, we use env vars.
# the PROTO_TO_JSONSCHEMA var controlls both what type of output to generate
# and where to put it

if [[ "$1" != "" ]]; then
    export PROTO_TO_JSONSCHEMA=$1
else
    export PROTO_TO_JSONSCHEMA=../generated/jsonschema
fi

rm -r $PROTO_TO_JSONSCHEMA 2> /dev/null
mkdir -p $PROTO_TO_JSONSCHEMA
protoc --plugin=protoc-gen-custom=custom-plugin.py --proto_path=../proto/ --custom_out=$PROTO_TO_JSONSCHEMA  ../proto/ccc/*.proto
echo "jsonschema code generated into $PROTO_TO_JSONSCHEMA"
unset PROTO_TO_JSONSCHEMA
