import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions/index';
import Wrap from './hoc/Wrap';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Market from './Market/Market';
import EditUser from './User/EditUser';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import LeftNavIcon from 'material-ui/svg-icons/social/group';
import IconButton from 'material-ui/IconButton';
import ModifyIcon from 'material-ui/svg-icons/action/settings';
import Message from './UI/Message';


class App extends Component {
  componentWillMount() {
    this.props.checkIfUserIsAuthenticated()
  }

  goHome = () => {
    this.props.history.push('/market')
  }

  editUser = () => {
    this.props.history.push('/edit')
  }

  render() {
    let rightButton = <FlatButton
      label="Sign in"
      containerElement={<Link to="/login" />}
    />
    if (this.props.authenticated) {
      rightButton = (
        <div className="nav-elements">
          <div className="nav-element">
            <p>
              Logged in as {this.props.username}
            </p>
          </div>
          <div className="nav-element">
            <IconButton onClick={this.editUser}
              tooltip="Modify user"
              iconStyle={{ fill: "white", }}
              style={{ marginRight: '50px', position: 'absolute', top: '6px', right: '74px' }}
            >
              <ModifyIcon />
            </IconButton>
          </div>

          <div className="nav-element">
            <FlatButton
              style={{ color: 'white', marginRight: '25px', marginTop: '-15px', display: 'inline-block' }}
              label="Logout"
              onClick={this.props.logout}
            />
          </div>
        </div>
      )
    }

    const baseUrl = process.env.PUBLIC_URL;
    return (
      <MuiThemeProvider>
        <Wrap>
          <AppBar
            title="Stock Market"
            iconElementLeft={<LeftNavIcon onClick={this.goHome} style={{ marginTop: '12px', marginRight: '15px', color: 'white' }} />}
            onTitleClick={this.goHome}
            iconElementRight={rightButton}
          />
          <Route path={baseUrl + "/"} component={Message} />
          <Route path={baseUrl + "/login"} component={Login} />
          <Route path={baseUrl + "/register"} component={Register} />
          <Route path={baseUrl + "/market"} component={Market} />
          <Route path={baseUrl + "/"} exact component={Market} />
          <Route path={baseUrl + "/edit"} component={EditUser} />
        </Wrap>
      </MuiThemeProvider>
    );
  }
}
const mapStateToProps = state => {
  return {
    authenticated: state.auth.authenticated,
    username: state.auth.username
  }
}
const mapDispatchToProps = dispatch => {
  return {
    checkIfUserIsAuthenticated: () => dispatch(actions.checkAuthentication()),
    logout: () => dispatch(actions.logout())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
