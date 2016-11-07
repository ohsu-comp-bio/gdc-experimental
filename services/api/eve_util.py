#!/usr/bin/env python

"""
utilities to support eve
"""

from flask import current_app as app, abort
from eve.utils import debug_error_message

import inspect


def mongo_to_GDC(resource_name, response):
    """
    eve event handler - format mongo response to match GDC
    see https://gdc-docs.nci.nih.gov/API/Users_Guide/Search_and_Retrieval/#example_1
    """  # nopep8
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


def on_insert_submission(items):
    """
    eve event handler - validate that project and program exist
    see https://gdc-docs.nci.nih.gov/API/Users_Guide/Submission/#making-requests-to-the-submission-api
    """   # nopep8
    app.logger.info('on_insert_submission: items: {}'.format(items))
    db = app.data.driver.db
    for item in items:
        pn = item['program_name']
        pc = item['project_code']
        _find_one_or_404(db.program,
                         {'name': pn},
                         'program_name: {} not found'.format(pn)
                         )
        _find_one_or_404(db.project,
                         {'project_code': pc},
                         'project_code: {} not found'.format(pc)
                         )


def _find_one_or_404(collection, query, message=None):
    """ utility to minimize repetitive code """
    item = collection.find_one(query)
    if not item:
        abort(404, message)
