#!/usr/bin/env python

"""
Elastic client
Query elastic
"""
import os
import requests
import urllib
from string import Template
from flask import Flask, request, jsonify, Response, json


ELASTIC_HOST = os.environ.get('ELASTIC_HOST', 'localhost')
ELASTIC_PORT = os.environ.get('ELASTIC_PORT', 9200)


def resource_search(request, app):
    """
    Resolve the search request using elastic search,
    return GDC formatted response.
    """
    (query, page, fields, sort, size, aggregation) = normalize_parameters(
                                                        request)

    # TODO apply JWT authorization to index string
    data = _esQuery('*-aggregated-resource',
                    query, page, fields, sort, size, aggregation)

    app.logger.info(data)  # log the query

    r = requests.post(_esURL('*-aggregated-resource', aggregation),
                      data=data,
                      headers={'content-type': 'application/json'})

    def _es_to_GDC(response_text):
        """ Make response look like GDC """
        #  https://gdc-docs.nci.nih.gov/API/Users_Guide/Search_and_Retrieval/#files-endpoint # nopep8
        response = json.loads(response_text)
        if 'hits' in response:
            # move the data from hits.hits to data.hits
            response['data'] = {'hits': response['hits']['hits']}
            # move each hit's _source:* to hit
            for hit in response['data']['hits']:
                hit.update(hit['_source'])
                del hit['_source']
            # delete what we've moved
            del response['hits']['hits']
            # setup pagination - TODO 'from' definition?
            response['pagination'] = {
                'count': len(response['data']['hits']),
                'sort': sort,
                'from': page,
                'pages': response['hits']['total'] / size,
                'total': response['hits']['total'],
                'page': page,
                'size': size,
            }
            del response['hits']
            #  setup warnings
        if 'error' in response:
            app.logger.info('error in response')
            response['warnings'] = response['error']['caused_by']
            del response['error']
        return json.dumps(response)

    app.logger.info(r.text)  # log the raw response
    return Response(_es_to_GDC(r.text), mimetype='application/json')


def normalize_parameters(request):
    """ retrieve parameters from request, set defaults """
    # query parameter should be in the form
    # https://gdc-docs.nci.nih.gov/API/Users_Guide/Search_and_Retrieval/#filters-specifying-the-query
    # sort parameter
    # https://gdc-docs.nci.nih.gov/API/Users_Guide/Search_and_Retrieval/#sort

    # coordinate with settings
    query = request.args.get('filters')
    page = request.args.get('page')
    fields = request.args.get('fields')
    sort = request.args.get('sort')
    aggregation = request.args.get('aggregation')
    size = request.args.get('size')
    if not page:
        page = 1
    if not size:
        size = 10
    if not query:
        query = '*'
    return (query, page, fields, sort, size, aggregation)

# *******************
# ES utility methods
# *******************


def _esURL(index='_all', aggregation=False):
    """return the ES url for a search or multi search"""
    if (aggregation):
        return "http://{}:{}/_msearch".format(ELASTIC_HOST, ELASTIC_PORT)
    else:
        return "http://{}:{}/{}/_search".format(ELASTIC_HOST, ELASTIC_PORT,
                                                index)


def _esQuery(index, query, page, fields, sort, size, aggregation):
    """return the ES query for a search or multi search"""
    if (aggregation):
        return _aggregationQuery(query=query, index=index, page=page,
                                 fields=fields, sort=sort)
    else:
        return _singleQuery(query=query, index=index, page=page,
                            fields=fields, sort=sort)


def _singleQuery(query, index='_all', page=1, size=10,
                 fields=None, sort=None):
    """
     formulate a simple query for ES _search
     returns a single line query
    """

    _from = (int(page)-1) * int(size)
    # projection
    if fields:
        # see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-source-filtering.html  # nopep8
        fields = fields.replace(" ", "")
        fields = '"_source":' + json.dumps(fields.split(',')) + ', '
    else:
        fields = ''
    # sort, default asc
    if sort:
        # see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html  # nopep8
        sort = sort.replace(" ", "")
        a = sort.split(':')
        order = 'asc'
        field = a[0]
        if (len(a) > 1):
            order = a[1]
        sort_dict = {}
        sort_dict[field] = {'order': order}
        sort = ',"sort":' + json.dumps([sort_dict])
    else:
        sort = ''

    t = Template("""{$fields "query":{"query_string":{"analyze_wildcard":true,"query":"$q"}},"from":$from,"size":$size $sort}""")  # nopep8
    return t.substitute({'q': query, 'index': index, 'from': _from,
                         'size': size, 'fields': fields, 'sort': sort})


def _aggregationQuery(query, index='_all', page=1, size=10,
                      fields=None, sort=None):
    """
    Given a query string, return a set of aggregations for an ES
    _msearch
    """
    t = Template("""
    {"index":"$index"}
    $single_query
    {"index":"$index","search_type":"count","ignore_unavailable":true}
    {"query":{"filtered":{"query":{"query_string":{"query":"$q","analyze_wildcard":true}},"filter":{"bool":{"must":[{"query":{"query_string":{"analyze_wildcard":true,"query":"$q"}}}],"must_not":[]}}}},"size":0,"aggs":{"age_at_diagnosis":{"histogram":{"field":"age_at_diagnosis","interval":10},"aggs":{"3":{"terms":{"field":"projectCode.raw","size":5,"order":{"_count":"desc"}}}}}}}
    """)  # nopep8
    return t.substitute({'q': query, 'index': index,
                         'single_query':
                         _singleQuery(query, index, page, size, fields, sort)})
