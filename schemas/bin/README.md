
# Bin

Process the proto schemas

`bin/generate-*.sh` wraps the call to protoc.  

To install the protocol buffer compiler, protoc, follow the instructions at
https://github.com/google/protobuf

To install python protobuf:

    git clone https://github.com/google/protobuf.git
    cd protobuf/python
    python setup.py install

usage
```
$ cd bin
$ ./generate-jsonschema.sh
$ ./generate-cereberus.sh
```
