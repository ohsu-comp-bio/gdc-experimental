#!/usr/bin/env python

""" provide schemas """

# complete schema will go here
json_schemas = {'definitions': {}}


def _init():
    import fnmatch
    import glob
    import json
    import jsonschema
    import os
    import sys

    definitions = json_schemas['definitions']

    # load all schema fragments
    path = os.path.join(os.path.dirname(__file__), "generated/jsonschema")

    schema_files = [os.path.join(dirpath, f)
                    for dirpath, dirnames, files in os.walk(path)
                    for f in fnmatch.filter(files, '*.json')]

    for schema_file in schema_files:
        with open(schema_file) as file_object:
            fragment = json.load(file_object)
            for key in fragment['definitions'].keys():
                definitions[key] = fragment['definitions'][key]

    # check the schema to ensure all OK
    jsonschema.Draft4Validator.check_schema(json_schemas)


def json_schema(key):
    """
    return a json string of a given schema
    """
    return json.dumps(json_schemas['definitions'][key])


_init()
