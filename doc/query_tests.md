
# Search comparison: Mongo v Elastic


## Example use cases

### Abstract

Given data:
```
{"blog_post": "the quick brown fox jumped over the lazy dog"}
```

### I need results where:

* fox `must be present`
* news `must not be present`
* quick and brown `are optional — their presence increases the relevance`

## Solutions

### Elastic:

```
quick brown +fox -news
```
Done.

### Mongo:

  * Before I can write the query, I need to know the property name (`blog_post`).  


```
{
  "$and":[
    {
      "$or":[
        {
          "$and":[
            {
              "blog_post":"quick"
            },
            {
              "blog_post":"fox"
            }
          ]
        },
        {
          "$or":[
            {
              "$and":[
                {
                  "blog_post":"brown"
                },
                {
                  "blog_post":"fox"
                }
              ]
            },
            {
              "blog_post":"fox"
            }
          ]
        }
      ]
    },
    {
      { "blog_post": { "$not": "news" } }
    }
  ]
}
```

### Concrete

Given data:
```
Arbitrary repository documents
```

### I need results where:

* age_at_diagnosis `must be between 75 and 80`
* skin biopsies    `must not be present`
* sex              `Male only`
* race             `no caucasian`
* diagnosis        `must have NEOPLASMS`
* biomarkers       `must have KIT and rs60179239`
* prefer clinical resources from BAML Stanford  `are optional — their presence increases the relevance`

## Solutions

### Elastic:

```
BAML clinical Stanford +Male  -skin  -white  +NEOPLASMS +KIT +rs60179239 AND age_at_diagnosis:[75 TO 80]
```

Done.

### Mongo:

?


## Summary


The Elastic interface is much more `user friendly` and `distraction free`.  As a result it has a better out of box experience and higher researcher and informatician productivity.

Obvious impacts of syntax aside, consider prerequisite to to understand the data dictionary. For this example, it is trivial there is only one property, but for practical real world searches `(Project, Individual, Sample, Resource)` we estimate a working vocabulary of 100 properties.  This is compounded quickly when we consider the permutations of multiple projects, each with their own subset/superset of the dictionary.


As a consequence of user friendliness, the Elastic interface is more `provider friendly`.  The user interaction with the data model is more malleable and less disruptive.  Since users are more self sufficient, engineering resources can be utilized elsewhere.  Adoption of the mongo interface for search will result in:
  * Higher costs for:
    * Training
    * Informatician support
  * Lower adoption rates

Broadly, the community has recognized this and there are many, many examples both in technology, architecture and deployment where mongo has been paired with elastic search.

## Recommendation

* Consider `buy vs build` and adopt either oicr/dcc or gdc portals, both of them using an elastic search engine.

* For `build`,
  * Retain elastic as the search engine
  * Continue adoption of a GDC inspired API layer, backed by authorization.
  * Improve the rigor of ccc's `system of record` pattern by moving from files submitted to the project to mongo.
