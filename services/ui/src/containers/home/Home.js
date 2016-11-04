import React, { Component } from 'react';

import './home.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">YA-DMS</h1>
            <p className="lead">
            <code>Yet Another DMS.</code>

            This implementation uses an API layer to communicate with data stores.
            The app uses several great
            technologies (such as
              <a href="https://github.com/facebook/react" target="_blank"> React</a>,
              <a href="http://python-eve.org/" target="_blank"> Flask/Eve</a>,
              <a href="https://https://jwt.io" target="_blank"> JSON Web Token</a>,
              <a href="https://www.mongodb.com/" target="_blank"> MongoDB</a>,
              <a href="https://www.elastic.co/guide/index.html" target="_blank"> Elastic Search</a>
            ) used together to develop a more complex web
            application, with features such as authentication, navigation, asynchronous data fetching, error handling, caching and pagination, etc.
            </p>

            <div className="home-humility">
              <a href="https://github.com/ohsu-computational-biology/gdc-experimental" target="_blank">
                <i className="fa fa-github" /> View on Github
              </a>
            </div>
          </div>
        </div>

        <div className="container">

        <h3>Evolution:</h3>
          <br/>
          <img alt="evolution" src="https://cloud.githubusercontent.com/assets/47808/19900453/d2521612-a020-11e6-90fe-1c17e7043bda.png" />

          <h3>Whats New</h3>
            <br/>
            <dl>
              <dt>Initial implementation.</dt>
            </dl>

          <h3>Feature highlights:</h3>
          <br/>
          <dl>
            <dt>Async Data fetching with caching and pagination</dt>
            <dd>
              The <code>Resources</code> allows the user to query against the API.
              The user interface was largely inspired by dcc & gdc.

               The async actions (see <code>resources</code>, and <code>todo...</code>
                under actions) fetch data from the following  APIs:
              <a href="https://github.com/ohsu-computational-biology/gdc-experimental/blob/api2/gdc-api/run.py#L52">
                <code>/v0/files</code>
              </a>
              <br />
              The fetched data are stored with the page number as the lookup key, so that the local copy can be shown without the need
              to re-fetch the same data remotely each time. However cached data can be invalidated if desired.
            </dd>
            <br />

            <dt>Data fetching error handling</dt>
            <dd>
              You can test this by disabling your internet connection. <br />
              The application would fail gracefully with the error message if data fetching (for a particular page) fails. However, the application
              can still show cached data for other pages, which is very desirable behavior.
            </dd>
            <br />

            <dt>Authentication and Page Restrictions</dt>
            <dd>
              Certain UI pages (<code>Resources</code> and <code>...</code>) are restricted.  You can only access them after signing in to the
              Application.
              When accessing restricted pages without signing in first, the application would redirect to the <code>Login</code> page.
              The authentication is based on JSON Web Token (JWT).
              For development, You can log in as user "admin" and password "password".
            </dd><br />

            <dt>WebSocket</dt>
            <dd>
              A "server alerts/notifications" use case is implemented to showcase Socket.IO.  Whenever a client logs in/out of the application using the API server,
              the API server will notify currently connected clients via Socket.IO.  You can test this use case by opening the the web app in two browsers side by side,
              and then log in/out the webapp in one browser, and observe the messages in the other browser.  The messages are pushed from the server to the clients in "real time",
              and show up as <code>Alerts</code> in the header section of the web app.
            </dd><br />

          </dl>
        </div>
      </div>
    );
  }
}
