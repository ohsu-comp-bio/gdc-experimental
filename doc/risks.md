## Risks


The Eve flask plugin is an elegant and productive tool for REST interfaces for mongo.  It has a [BSD licence](http://python-eve.org/license.html)

The Eve's [elastic plugin] (https://github.com/petrjasek/eve-elastic) is a separate project from a different author.
It has some risks:
*  it is [GPL3!](https://github.com/petrjasek/eve-elastic#license)
*  it was written as part of a [publishing project](https://github.com/superdesk/superdesk/)
*  apparently only [supports](https://github.com/superdesk/superdesk/#dependencies-for-non-docker-installations) a very old version of ElasticSearch <= 1.7.x
*  combined configuration of mongo and eve is puzzling?
  * https://github.com/petrjasek/eve-elastic/issues/15
  * https://github.com/petrjasek/eve-elastic/issues/51
