#!/bin/bash
# use protoc to create cerebus friendly json code

# since we cannot pass flags to our plugin, we use env vars.
# the PROTO_TO_CERBERUS var controlls both what type of output to generate
# and where to put it
if [[ "$1" != "" ]]; then
    export PROTO_TO_CERBERUS=$1
else
    export PROTO_TO_CERBERUS=../cccschema/generated/cerberus
fi

PROTO_PATH=../cccschema/proto

rm -r $PROTO_TO_CERBERUS 2> /dev/null
mkdir -p $PROTO_TO_CERBERUS
protoc --plugin=protoc-gen-custom=custom-plugin.py --proto_path=$PROTO_PATH --custom_out=$PROTO_TO_CERBERUS $PROTO_PATH/ccc/*.proto
echo "cerberus code generated into $PROTO_TO_CERBERUS"
unset PROTO_TO_CERBERUS
