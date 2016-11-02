import React from 'react';

const About = () => {
  return (
    <div className="container">
      <h1 className="display-3">About Us</h1>

      <p>
        Thanks for checking this out.
        <br/>
        This project was created by ....
        TODO - links to team, libraries ...
      </p>

      <p>
        For more information see the following each
        addressing an important aspect of web development: <a href="https://github.com/facebook/react" target="_blank">React </a>
        as the V (view), and <a href="https://github.com/rackt/redux" target="_blank"> Redux </a> as the
        predictable state container.  Integrations: Mongo, ElasticSearch, and Kafka.
      </p>

      <p>
        ... ,  ccc development has never been more fun
        and productive.
      </p>
    </div>
  );
};

export default About;
