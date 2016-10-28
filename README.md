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

```
