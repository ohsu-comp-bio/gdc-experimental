#!/usr/bin/env python

"""
utilities to support eve
"""


def mongo_to_GDC(resource_name, response):
    """ eve event handler - format mongo response to match GDC """
    # https://gdc-docs.nci.nih.gov/API/Users_Guide/Search_and_Retrieval/#example_1
    response['data'] = {'hits': response['_items']}
    del response['_items']
    response['pagination'] = {
        'count': len(response['data']['hits']),
        'sort': None,
        'from': response['_meta']['page'],
        'pages': response['_meta']['total'] / response['_meta']['max_results'],
        'total': response['_meta']['total'],
        'page': response['_meta']['page'],
        'size': response['_meta']['max_results'],
    }
    del response['_meta']
