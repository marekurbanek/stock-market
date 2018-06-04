import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import {Redirect} from 'react-router-dom';
import { Link } from 'react-router-dom'


import { Grid, Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


class Login extends Component {
    state = {
        login: null,
        password: null
    }

    loginChanged = (event, newVal) => {
        this.setState({ login: newVal })
    }
    passwordChanged = (event, newVal) => {
        this.setState({ password: newVal })
    }
    render() {

        let authRedirect = null;
        if (this.props.authenticated) {
            authRedirect = <Redirect to='/market'/>
        }

        return (
            <Grid>
                {authRedirect}
                <Row>
                    <Col sm={12} md={6} mdOffset={3} className="text-center">
                        <Paper zDepth={5} style={{ padding: '20px', marginTop: '50px', borderRadius: '10px' }}>
                            <h2>Login</h2>
                            <p>If you don't have an account please register <Link to="/register">here</Link></p>
                            <TextField
                                onChange={this.loginChanged}
                                hintText="Username"
                                floatingLabelText="Username"
                                floatingLabelFixed={true}
                            /><br />
                            <TextField
                                onChange={this.passwordChanged}
                                style={{ marginTop: '15px' }}
                                hintText="Password"
                                type="password"
                                floatingLabelText="Password"
                                floatingLabelFixed={true}
                            /><br />
                            <RaisedButton
                                onClick={() => this.props.tryLogin(this.state.login, this.state.password)}
                                label="Login"
                                primary={true}
                                style={{ marginTop: '25px' }} />
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.auth.authenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        tryLogin: (login, password) => dispatch(actions.tryLogin(login, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);