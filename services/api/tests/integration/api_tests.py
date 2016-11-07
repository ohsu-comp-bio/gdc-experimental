#!/usr/bin/env python
"""
    Test API endpoints
"""


def test_status_returns_ok(client):
    """
    should respond with ok and Anonymous
    """
    r = client.get('/v0/status')
    assert r.status_code == 200
    assert r.json['status'] == 'OK'
    assert r.json['user'] == 'Anonymous'


def test_authenticated_status_returns_user_org_name(client):
    """
    should respond with ok and user
    """
    r = client.get('/v0/status', headers=[('Authorization', 'Bearer eyJBQ0NFU1NfVE9LRU4iOiJleUpoYkdjaU9pSlNVekkxTmlKOS5leUpsZUhBaU9qRTFNRGcyTURjME1UTXNJbUYxWkNJNkltUXpZMkZtTVRVeUxUUXhPRGd0TkdNeE9TMDVOVFEzTFRBd01UTmxOelkwTmpFeVpDSXNJbWx6Y3lJNkltaDBkSEE2WEM5Y0x6RTVNaTR4TmpndU1TNHlNelk2T0RBNE5Gd3ZiM0JsYm1sa0xXTnZibTVsWTNRdGMyVnlkbVZ5TFhkbFltRndjRnd2SWl3aWFuUnBJam9pTkRObFpHTTVaalV0WkRRd05TMDBNMlE0TFdKaU56Z3ROakUwWkdRMU16RmlabVl3SWl3aWFXRjBJam94TkRjM01EY3hOREV6ZlEuSXdDYUI1eUhZbTdRR2JLa0kyOC1XT2JWa3ptUUdyVHdxSms0SHFkUzJLaVg1UHdFRW1Zdk9xY1NwbFZjQUhoWGlqNzJ3ekdDLWh6dzliUXRMY2lkMlZmRTVLLVA0TzhHcmhhaUVSTXBvXzZWN0p4MU40SXRqNzdzYXZNTVhFc2d0aGk0UG1hajlTMUhSZk9lVkN5V1JCYUFOT1QtOHV6YzdKVkpVbDNOTTh4anZTVHBRV1JuMF9wLUhqVEJpQ0JkRm9xaXRFbWUtM3NobXotX05uTThkcENhZlhrMVdaRmFQZjJuSjItR1JDZm9oeW5IMlU2Q1Z5M0w5VWRXTTJpcndQM3NYSTROV19HUl9HNVVMeDE1ODNMTHF4dzdaRU5HOTEwTGQzTGRUeU5MU3VHRW1pakRuMk1Eb0xiU2FnVUVMMl9jQzlzZ2hCT0pZb3M1cXIxbnJRIiwiSURfVE9LRU4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0ltdHBaQ0k2SW5KellURWlmUS5leUpsZUhBaU9qRTFNRGcyTURjME1UTXNJbk4xWWlJNkltSnNZeUlzSW01dmJtTmxJam9pT1dNeE1UZzVZVEJrTkRZM0lpd2libUZ0WlNJNkltSnNZeUlzSW1GMVpDSTZJbVF6WTJGbU1UVXlMVFF4T0RndE5HTXhPUzA1TlRRM0xUQXdNVE5sTnpZME5qRXlaQ0lzSW1semN5STZJbWgwZEhBNlhDOWNMekU1TWk0eE5qZ3VNUzR5TXpZNk9EQTRORnd2YjNCbGJtbGtMV052Ym01bFkzUXRjMlZ5ZG1WeUxYZGxZbUZ3Y0Z3dklpd2lhV0YwSWpveE5EYzNNRGN4TkRFekxDSnZjbWRoYm1sNllYUnBiMjVmYm1GdFpTSTZJa2x1ZEdWc0lpd2lhMmxrSWpvaWNuTmhNU0o5Lm9DX1hNR2RYdmdLN0o2eVRZcWNyYng5alZIQzFUZ0M5RnlSd3Ntd285OElhd0ZGU2U5aGtjMjVydVR6Y2pRT1RRM3JuNUF1MnNKMVZjcjM3ZXc3dUtweUlIb3Izb1dvUDF6QmNzc0xSQjJnRWxhYjZHT1V4YVJsdDJDVFVpSGk0Q19reWdxMThZYlVmUzBMWVhrYmJsaUgyVm9CWEFOLUN5Q2VvS1NuaEFsWjNUMGV3ZTlra2dYcVBQRVNsRi1yZWFhUmFOMG5TMHNsLUZhSXBab2VLZnBKRWhmMl9FcHEzLW5NUFRxV1Z4Zmw5N3dJbTQzQk9uMk1kOFR1cDhwSURmcnJuemRjOU1LNWM5c1dJelpfZjdScXlxanhRa0VsU2ZxTmx0dHhtX09hSjhuUlpscTFHZGpVb1lFY3FSY1NyTEJ0VWtDSDh6NUhDbG1yZDhnOFFMZyIsIlJFRlJFU0hfVE9LRU4iOiJleUpoYkdjaU9pSnViMjVsSW4wLmV5SnFkR2tpT2lJeU9HRTBabVV5TmkxaFpHRTFMVFExWXprdFlXVmpZeTFrWmpZME1tSTJabU5tWW1NaWZRLiJ9')])  # nopep8
    assert r.status_code == 200
    assert r.json['status'] == 'OK'
    assert r.json['user'] == 'Intel.blc'


def test_files_list_elastic_returns_gdc_formatted_response(client):
    """
    should respond with data.hits of at least one file, pagination
    """
    r = client.get('/v0/files')
    _files_list_assertations(r)


def test_files_list_mongo_returns_gdc_formatted_response(client):
    """
    should respond with data.hits of at least one file, pagination
    Note: this endpoint exists only to compare es v mongo queries
    """
    r = client.get('/v0/files-mongo')
    _files_list_assertations(r)


def _files_list_assertations(r):
    """
    es and mongo should respond the same
    """
    assert r.status_code == 200
    assert isinstance(r.json, dict)
    assert 'data' in r.json
    assert 'hits' in r.json['data']
    assert isinstance(r.json['data']['hits'], list)
    assert len(r.json['data']['hits']) > 0
    assert 'pagination' in r.json
    expected_pagination = ('pages', 'total', 'page', 'size', 'from', 'count')
    assert all(k in r.json['pagination'] for k in expected_pagination)


def test_files_post_creates_data(client):
    """
    We should be able to save a resource
    """
    r = client.post('/v0/files', data=TEST_RESOURCE)
    assert r.status_code == 201
    assert r.json['_status'] == 'OK'
    assert r.json['_id'] is not None


def test_files_reads_data(client):
    """
    We should be able to save and read a resource
    """
    r = client.post('/v0/files', data=TEST_RESOURCE)
    assert r.status_code == 201
    assert r.json['_id'] is not None
    r = client.get('/v0/files/{}'.format(r.json['_id']))
    assert r.status_code == 200
    assert r.json['_id'] is not None
    assert r.json['url'] == TEST_RESOURCE['url']


def test_submission_checks_program_project(client):
    """
    We should not be able to save a submission with a bad program or project
    """
    r = client.post('/v0/submission/foo/bar', data=TEST_BAD_SUBMISSION)
    assert r.status_code == 404


def test_projects_returns_ok(client):
    """
    faker should respond with at least ok and [{}]
    """
    r = client.get('/v0/projects')
    assert r.status_code == 200
    assert isinstance(r.json, list)
    assert len(r.json) > 0


def test_cases_returns_ok(client):
    """
    faker should respond with at least ok and [{}]
    """
    r = client.get('/v0/cases')
    assert r.status_code == 200
    assert isinstance(r.json, list)
    assert len(r.json) > 0


# a resource to save.  TODO - test fixtures
TEST_RESOURCE = {'url': 'foo'}
TEST_BAD_SUBMISSION = {'bob': 'your uncle'}
