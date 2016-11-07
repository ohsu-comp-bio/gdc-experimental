#!/usr/bin/env python

import os

MONGO_HOST = os.environ.get('MONGO_HOST', 'localhost')
MONGO_PORT = os.environ.get('MONGO_PORT', 27017)
MONGO_USERNAME = os.environ.get('MONGO_USERNAME', '')
MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD', '')
MONGO_DBNAME = os.environ.get('MONGO_DBNAME', 'test')


# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH) and deletes of individual items
# (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'DELETE']

# We enable standard client cache directives for all resources exposed by the
# API. We can always override these global settings later.
CACHE_CONTROL = 'max-age=20'
CACHE_EXPIRES = 20

# make query parameters conform to GDC
# https://gdc-docs.nci.nih.gov/API/Users_Guide/Search_and_Retrieval/#components-of-a-request
# Default value for QUERY_MAX_RESULTS. Defaults to 25.
PAGINATION_DEFAULT = 10
# Key for the filters query parameter. Defaults to where.
QUERY_WHERE = 'filters'
# Key for the projections query parameter. Defaults to projection.
QUERY_PROJECTION = 'fields'


# not used
HATEOAS = False

# conform with GDC
API_VERSION = 'v0'

# important - we don't need to overly specify schemas
ALLOW_UNKNOWN = True

# *******************
# schema for /v0/files
# *******************
# Simplest possible schema...as long as there is an id

# CRUD is routed to mongo collection aggregated_resource

# Search is routed to flask route /v0/files.
# (Controlled by resource_methods, note no 'GET')
# TODO - '_id' used for test data, normalize to 'id'
file = {
    'schema': {
        '_id': {'type': 'string'}
    },
    'datasource': {
        'source': 'aggregated_resource',
    },
    'resource_methods': ['POST', 'DELETE']
}

# stub for testing elastic v mongo search. TODO remove
file_mongo = {
    'schema': {
        '_id': {'type': 'string'}
    },
    'datasource': {
        'source': 'aggregated_resource',
    },
    'resource_methods': ['GET', 'POST', 'DELETE']
}

program = {
    'schema': {
        'id': {'type': 'string'},
        'name': {'type': 'string'},
        'code': {'type': 'string'},
    },
    'datasource': {
        'source': 'program',
    }
}

project = {
    'schema': {
        'id': {'type': 'string'},
        'name': {'type': 'string'},
        'code': {'type': 'string'},
    },
    'datasource': {
        'source': 'project',
    }
}

submission = {
    'url': 'submission/<regex(".*"):program_name>/<regex(".*"):project_code>/',
    'schema': {
        'id': {'type': 'string'},
        'type': {'type': 'string'},
        'submitter_id': {'type': 'string'},
        'program_name': {'type': 'string'},
        'project_code': {'type': 'string'},
    },
    'datasource': {
        'source': 'submission',
    },
    'resource_methods': ['GET', 'POST', 'DELETE']
}


# The DOMAIN dict explains which resources will be available and how they will
# be accessible to the API consumer.
DOMAIN = {
    'files': file,
    'files-mongo': file_mongo,   # stub for testing elastic v mongo search
    'submission': submission,
    'project': project,
    'program': program,
}
