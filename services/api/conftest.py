#!/usr/bin/env python
"""
configure tests - returns a reference to the app
"""

import run
import pytest


@pytest.fixture
def app():
    return run.app
