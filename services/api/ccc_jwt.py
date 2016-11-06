#!/usr/bin/env python

"""
JWT
support ccc mitre tokens
"""

from eve.auth import BasicAuth
from base64 import b64decode
import ast
import jwt


def getUser(request):
    user = 'Anonymous'
    bearer_prefix = 'Bearer '
    header_token = request.headers.get('authorization')
    if header_token and header_token.startswith(bearer_prefix):
        token = header_token[len(bearer_prefix):]
        ba = BearerAuth()
        id_dict = ba.parse_token(token)
        user = "{}.{}".format(id_dict['organization_name'], id_dict['name'])
    return user


def make_dev_id_token(profile):
    """ Create an ID token - development only """
    # This should be well-guarded secret on the server (in a file or database).
    JWT_SECRET = "JWT Rocks!"
    return jwt.encode(profile, JWT_SECRET, headers={'exp': 1000*60})


class BearerAuth(BasicAuth):
    """ Override buildin basic auth
    """
    def __init__(self):
        super(BearerAuth, self).__init__()

    def decode_token(self, token):
        myToken = ast.literal_eval(b64decode(token).decode('UTF-8'))
        return myToken

    def parse_token(self, token, key='ID_TOKEN'):
        parsed_token = self.decode_token(token)
        token_part = parsed_token[key]
        return jwt.decode(token_part, verify=False)

    def check_auth(self, token, allowed_roles, resource, method):
        """
        This function replaces the builting check_auth, and can perform
        arbitrary actions based on the result of the
        Access Control Rules Engine.
        """
        # send to rule engine
        rule_engine_result = False
        # return result of query
        return rule_engine_result
