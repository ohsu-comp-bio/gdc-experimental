import run
import pytest


@pytest.fixture
def app():
    return run.app
