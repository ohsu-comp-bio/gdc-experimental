# gdc-experimental
An exploration of the gdc api.

A very preliminary implementation of the api described at
https://gdc-docs.nci.nih.gov/API/Users_Guide/Getting_Started/#api-endpoints

Leverages the gdc data dictionary
https://github.com/NCI-GDC/gdcdictionary


For example:

```
# set to your host
$ export GDC_API=http://192.168.99.100:8000

# call api

$ curl $GDC_API/v0/status
{
  "commit": "snapshot",
  "status": "OK",
  "tag": "1.4.0",
  "version": 1
}


curl $GDC_API/v0/files | jq .
{
  "submitter_id": null,
  "file_name": "irure laboris id eiusmod et",
  "file_size": -30788859,
  "md5sum": "mollit",
  "state": "submitted"
}

curl $GDC_API/v0/projects  | jq .
{
  "code": "Excepteur",
  "name": "Lorem do",
  "disease_type": "dolor esse irure minim anim",
  "state": "processing",
  "primary_site": "proident nisi in",
  "programs": [
    {
      "submitter_id": "irure labore anim ad"
    },
    {
      "id": "BbA03Dbc-1958-e51A-08cC-5d86CD6A5ad2"
    }
  ],
  "dbgap_accession_number": "incididunt",
  "type": "ad ipsum ea i",
  "released": true
}


curl $GDC_API/v0/status  -H "Authorization: Bearer eyJBQ0NFU1NfVE9LRU4iOiJleUpoYkdjaU9pSlNVekkxTmlKOS5leUpsZUhBaU9qRTFNRGcyTURjME1UTXNJbUYxWkNJNkltUXpZMkZtTVRVeUxUUXhPRGd0TkdNeE9TMDVOVFEzTFRBd01UTmxOelkwTmpFeVpDSXNJbWx6Y3lJNkltaDBkSEE2WEM5Y0x6RTVNaTR4TmpndU1TNHlNelk2T0RBNE5Gd3ZiM0JsYm1sa0xXTnZibTVsWTNRdGMyVnlkbVZ5TFhkbFltRndjRnd2SWl3aWFuUnBJam9pTkRObFpHTTVaalV0WkRRd05TMDBNMlE0TFdKaU56Z3ROakUwWkdRMU16RmlabVl3SWl3aWFXRjBJam94TkRjM01EY3hOREV6ZlEuSXdDYUI1eUhZbTdRR2JLa0kyOC1XT2JWa3ptUUdyVHdxSms0SHFkUzJLaVg1UHdFRW1Zdk9xY1NwbFZjQUhoWGlqNzJ3ekdDLWh6dzliUXRMY2lkMlZmRTVLLVA0TzhHcmhhaUVSTXBvXzZWN0p4MU40SXRqNzdzYXZNTVhFc2d0aGk0UG1hajlTMUhSZk9lVkN5V1JCYUFOT1QtOHV6YzdKVkpVbDNOTTh4anZTVHBRV1JuMF9wLUhqVEJpQ0JkRm9xaXRFbWUtM3NobXotX05uTThkcENhZlhrMVdaRmFQZjJuSjItR1JDZm9oeW5IMlU2Q1Z5M0w5VWRXTTJpcndQM3NYSTROV19HUl9HNVVMeDE1ODNMTHF4dzdaRU5HOTEwTGQzTGRUeU5MU3VHRW1pakRuMk1Eb0xiU2FnVUVMMl9jQzlzZ2hCT0pZb3M1cXIxbnJRIiwiSURfVE9LRU4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0ltdHBaQ0k2SW5KellURWlmUS5leUpsZUhBaU9qRTFNRGcyTURjME1UTXNJbk4xWWlJNkltSnNZeUlzSW01dmJtTmxJam9pT1dNeE1UZzVZVEJrTkRZM0lpd2libUZ0WlNJNkltSnNZeUlzSW1GMVpDSTZJbVF6WTJGbU1UVXlMVFF4T0RndE5HTXhPUzA1TlRRM0xUQXdNVE5sTnpZME5qRXlaQ0lzSW1semN5STZJbWgwZEhBNlhDOWNMekU1TWk0eE5qZ3VNUzR5TXpZNk9EQTRORnd2YjNCbGJtbGtMV052Ym01bFkzUXRjMlZ5ZG1WeUxYZGxZbUZ3Y0Z3dklpd2lhV0YwSWpveE5EYzNNRGN4TkRFekxDSnZjbWRoYm1sNllYUnBiMjVmYm1GdFpTSTZJa2x1ZEdWc0lpd2lhMmxrSWpvaWNuTmhNU0o5Lm9DX1hNR2RYdmdLN0o2eVRZcWNyYng5alZIQzFUZ0M5RnlSd3Ntd285OElhd0ZGU2U5aGtjMjVydVR6Y2pRT1RRM3JuNUF1MnNKMVZjcjM3ZXc3dUtweUlIb3Izb1dvUDF6QmNzc0xSQjJnRWxhYjZHT1V4YVJsdDJDVFVpSGk0Q19reWdxMThZYlVmUzBMWVhrYmJsaUgyVm9CWEFOLUN5Q2VvS1NuaEFsWjNUMGV3ZTlra2dYcVBQRVNsRi1yZWFhUmFOMG5TMHNsLUZhSXBab2VLZnBKRWhmMl9FcHEzLW5NUFRxV1Z4Zmw5N3dJbTQzQk9uMk1kOFR1cDhwSURmcnJuemRjOU1LNWM5c1dJelpfZjdScXlxanhRa0VsU2ZxTmx0dHhtX09hSjhuUlpscTFHZGpVb1lFY3FSY1NyTEJ0VWtDSDh6NUhDbG1yZDhnOFFMZyIsIlJFRlJFU0hfVE9LRU4iOiJleUpoYkdjaU9pSnViMjVsSW4wLmV5SnFkR2tpT2lJeU9HRTBabVV5TmkxaFpHRTFMVFExWXprdFlXVmpZeTFrWmpZME1tSTJabU5tWW1NaWZRLiJ9"
{
  "commit": "snapshot",
  "status": "OK",
  "tag": "1.4.0",
  "user": "blc.Intel",
  "version": 1
}
```
