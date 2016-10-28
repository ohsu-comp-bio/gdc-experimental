import React, { Component } from 'react';

import './home.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">Yet Another DMS</h1>
            <p className="lead">
            This is yet another DMS.
            However, this one is crafted to attempts to go beyond the typical simple boilerplates, by showcasing several great
            technologies (such as
              <a href="https://github.com/facebook/react" target="_blank"> React</a>,
              <a href="http://python-eve.org/" target="_blank"> Flask/Eve</a>,
              <a href="https://www.elastic.co/guide/index.html" target="_blank"> Elastic search</a>,
              <a href="https://https://jwt.io" target="_blank"> JSON Web Token</a>
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

          <h3>Whats New</h3>
            <p>
              Initial implementation.
            </p>



          <h3>Feature highlights:</h3>
          <br/>
          <dl>
            <dt>Async Data fetching with caching and pagination</dt>
            <dd>
              The <code>UsersPage</code> and <code>ReposPage</code> would show most followed Github users (with 1000+ followers)
              and most starred Github repos (with 10000+ stars).  The async actions (see <code>users</code>, and <code>repos</code>
                under actions) fetch data from the following Github APIs: <br />
              <code>https://api.github.com/search/users?q=followers:>1000&order=desc&page=1</code> <br />
              <code>https://api.github.com/search/repositories?q=stars:>10000&order=desc&page=1</code> <br />
              The fetched data are stored with the page number as the lookup key, so that the local copy can be shown without the need
              to re-fetch the same data remotely each time. However cached data can be invalidated if desired.
            </dd>
            <br />

            <dt>Data fetching error handling</dt>
            <dd>
              You can test this by disabling your internet connection. Or even better, you can page through <code>UsersPage</code> or <code>ReposPage</code>
              very quickly and hopefully invoke Github's API rate limit for your IP address. <br />
              The application would fail gracefully with the error message if data fetching (for a particular page) fails. However, the application
              can still show cached data for other pages, which is very desirable behavior.
            </dd>
            <br />

            <dt>Authentication and Page Restrictions</dt>
            <dd>
              Certain UI pages (<code>UsersPage</code> and <code>ReposPage</code>) are restricted.  You can only access them after signing in to the
              Application.
              When accessing restricted pages without signing in first, the application would redirect to the <code>Login</code> page.
              You can log in as user "admin" and password "password".  The authentication is based on JSON Web Token (JWT).
            </dd><br />

            <dt>WebSocket</dt>
            <dd>
              A "server alerts/notifications" use case is implemented to showcase Socket.IO.  Whenever a client logs in/out of the application using the API server,
              the API server will notify currently connected clients via Socket.IO.  You can test this use case by opening the the web app in two browsers side by side,
              and then log in/out the webapp in one browser, and observe the messages in the other browser.  The messages are pushed from the server to the clients in "real time",
              and show up as <code>Alerts</code> in the header section of the web app.
            </dd><br />

            <dt>Non-Univeral</dt>
            <dd>
              Most people probably would listed this under "issues" or "wish list" instead, since these days a web application is not "cutting edge"
              or "cool" if it's not universal (isomorphic). However there are many cases
              where server-side rendering is simply not required or applicable (e.g. Java backend instead of Node).
            </dd>
          </dl>
        </div>
      </div>
    );
  }
}
