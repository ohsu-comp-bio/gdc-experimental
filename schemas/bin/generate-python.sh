#!/bin/bash
# use protoc to create python code 
# see https://developers.google.com/protocol-buffers/
export PY_OUT=/tmp/PY_OUT
rm -r $PY_OUT
mkdir $PY_OUT
protoc --proto_path=../proto/ --python_out=$PY_OUT  ../proto/ccc/*.proto
echo "code generated into $PY_OUT" 
