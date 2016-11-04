import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import UserProfile from './UserProfile';
import Alerts from './Alerts';
import './header.css';

export default class Header extends Component {
  onLogoutClick = (event) => {
    event.preventDefault();
    this.props.handleLogout();
  }

  render() {
    const { user } = this.props;
    const pathname = this.props.location.pathname;
    const isLoginPage = pathname.indexOf('login') > -1;
    const isAboutPage = pathname.indexOf('about') > -1;
    const isResourcesPage = pathname.indexOf('resources') > -1;

    return (
      !isLoginPage &&
      <div className="pos-f-t">
        <div className="collapse" id="navbar-header">
          <div className="container bg-inverse p-a-1" />
        </div>
        <nav className="navbar navbar-light bg-faded navbar-fixed-top">
          <div className="container-fluid">
            <button type="button" className="navbar-toggle pull-xs-left hidden-sm-up" data-toggle="collapse" data-target="#collapsingNavbar">&#9776;</button>

            <div id="collapsingNavbar" className="collapse navbar-toggleable-xs">
               <IndexLink to="/" className="navbar-brand">
                <div title="Home" className="brand"/>
                Home
              </IndexLink>
              <ul className="nav navbar-nav">
                <li title="CCC Resources" className={isResourcesPage ? 'nav-item active' : 'nav-item'}><Link className="nav-link" to="/resources">Resources</Link></li>
                <li title="About" className={isAboutPage ? 'nav-item active' : 'nav-item'}><Link className="nav-link" to="/about">About</Link></li>
              </ul>

              <ul className="nav navbar-nav pull-right">
                <Alerts />
                <UserProfile user={user} handleLogout={this.onLogoutClick} />
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  location: React.PropTypes.object,
};
