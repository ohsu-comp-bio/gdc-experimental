# API

Exposes multiple endpoints `/v0/*`.


## Testing
Is very preliminary at this time.

The tests that do exist are integration tests,
that is they test the API with the backends, no mocks exists.
Therefore, real databases need to exist and the server
needs to be able to connect to them.


```
# run tests from container
$ docker exec -it api  bash

# for some reason, this needs to be set in order to
# for eve to run ( gets config not found otherwise )
$ export EVE_SETTINGS=$(pwd)/settings.py

# then start tests
$ py.test
platform linux2 -- Python 2.7.11, pytest-3.0.3, py-1.4.31, pluggy-0.4.0
rootdir: /service, inifile: pytest.ini
plugins: flask-0.10.0
collected 9 items

tests/integration/api_tests.py ......
9 passed in 0.17 seconds

```
