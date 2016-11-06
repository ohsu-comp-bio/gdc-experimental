#!/usr/bin/env python

"""
read elasticdump from stdin, strip ES meta, write to stdout.
TODO - investigating replace with jq script?
"""
import json
import sys


for line in sys.stdin:
    row = json.loads(line)
    row['_source']['_id'] = row['_id']
    sys.stdout.write("{}\n".format(json.dumps(row['_source'])))
