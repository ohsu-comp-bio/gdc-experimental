#!/usr/bin/env python

"""
Implementation of the gdc api. Relies on gdc-backend, a mock data faker.
https://gdc-docs.nci.nih.gov/API/Users_Guide/Getting_Started/#api-endpoints
"""

import os
from eve import Eve
from flask import Flask, request, jsonify, Response, json
from flask_cors import CORS, cross_origin
from flask import abort

# our utilities
import ccc_jwt
import elastic_client
import eve_util
import faker_client


def _configure_app():
    # start the app
    app = Eve()
    # allow cross site access
    CORS(app)
    # add GDC formatter to response
    app.on_fetched_resource += eve_util.mongo_to_GDC
    # submission helper
    app.on_insert_submission += eve_util.on_insert_submission
    return app

app = _configure_app()

# API entry points


@app.route('/v0/status')
def status():
    """Status Get the API status and version information"""
    return jsonify({
      "commit": "snapshot",
      "status": "OK",
      "tag": "1.4.0",
      "version": 1,
      'user': ccc_jwt.getUser(request)
    })


@app.route('/v0/projects')
def projects():
    """Search & Retrieval Search all data generated by a project"""
    return faker_client.cccFakeResponse('Project', request)


@app.route('/v0/cases')
def cases():
    """Search & Retrieval Find all files related to a specific case,
     or sample donor."""
    return faker_client.cccFakeResponse('Individual', request)


@app.route('/v0/files')
def files():
    """
    Search & Retrieval Find all files with specific characteristics such
    as file_name, md5sum, data_format and others.
    See DOMAIN in settings.py for more information on CRUD for this entity
    """
    return elastic_client.resource_search(request, app)


@app.route('/v0/annotations')
def annotations():
    """Search & Retrieval Search annotations added to data after curation"""
    pass


@app.route('/v0/data')
def data():
    """Download Used to download GDC data"""
    pass


@app.route('/v0/manifest')
def manifest():
    """Download Generates manifests for use with GDC Data Transfer Tool"""
    pass


@app.route('/v0/slicing')
def slicing():
    """BAM Slicing Allows remote slicing of BAM format objects"""
    pass


# @app.route('/v0/submission/<program_name>/<project_code>')
# def submission(program_name, project_code):
#     """Submission Returns the available resources at the top level above
#     programs i.e., registered programs"""
#     # call Eve-hooks consumers for this  event
#     return getattr(app, "submission_eve_fetched")()


@app.route('/api/logout', methods=['POST'])
def _development_logout():
    """stub manual logout"""
    return jsonify(
        {'message': 'development user logged out'}
    )


@app.route('/api/login', methods=['POST'])
def _development_login():
    """stub manual login"""
    credentials = request.get_json(silent=True)
    app.logger.info(credentials)

    # In real world credentials should be authenticated against database.
    # For our purpose it's hard-coded:
    if (credentials['user'] == 'admin' and
            credentials['password'] == 'password'):
        # Once authenticated, the user profiles is signed and the jwt token
        # is returned as response to the client.
        # It's expected the jwt token will be included
        # in the subsequent client requests.
        profile = {'user': credentials['user'], 'role': 'ADMIN'}
        id_token = ccc_jwt.make_dev_id_token(profile)
        return jsonify({'id_token': id_token})
    else:
        return Response('Invalid user/password',
                        401, {'message': 'Invalid user/password'})


# Private util functions

# Entry point of app
if __name__ == '__main__':
    # eve doesn't support standard "flask run", so set props here
    debug = 'API_DEBUG' in os.environ
    api_port = int(os.environ.get('API_PORT', '5000'))
    api_host = os.environ.get('API_HOST', '0.0.0.0')
    app.run(debug=debug, port=api_port, host=api_host)
