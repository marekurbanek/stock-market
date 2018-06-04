import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom'

import RegisterWallet from './RegisterWallet';
import Wrap from '../hoc/Wrap';

import { Grid, Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


class Register extends Component {
    state = {
        login: null,
        password: null,
        goToWallet: false,
    }

    loginChanged = (event, newVal) => {
        this.setState({ login: newVal })
    }
    passwordChanged = (event, newVal) => {
        this.setState({ password: newVal })
    }

    goToWallet = () => {
        this.setState({ goToWallet: true })
    }

    render() {
        let fieldRequiredMsg = null
        const isFormValid = this.state.login === null || this.state.password === null
            || this.state.login.length === 0 || this.state.password.length === 0

        if (isFormValid) {
            fieldRequiredMsg =
                <p>
                    Username and password are required.
                </p>
        }
        let registerForm = (
            <Wrap>
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
                {fieldRequiredMsg}
                <RaisedButton
                    style={{ marginTop: '25px' }}
                    label="Next"
                    onClick={this.goToWallet}
                    disabled={isFormValid}
                />
            </Wrap>
        )

        if (this.state.goToWallet) {
            registerForm = (
                <RegisterWallet
                    login={this.state.login}
                    password={this.state.password}
                    tryRegister={this.props.tryRegister} />
            )
        }
        let authRedirect = null;
        if (this.props.registerSuccess) {
            authRedirect = <Redirect to='/login' />
        }

        return (
            <Grid>
                {authRedirect}
                <Row>
                    <Col sm={12} md={6} mdOffset={3} className="text-center">
                        <Paper zDepth={5} style={{ padding: '20px', marginTop: '50px', borderRadius: '10px' }}>
                            <h2>Register</h2>
                            <p>If you allready have an account please login <Link to="/login">here</Link></p>
                            {registerForm}
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        registerSuccess: state.auth.registerSuccess
    }
}

const mapDispatchToProps = dispatch => {
    return {
        tryRegister: (login, password, walletData) => dispatch(actions.tryRegister(login, password, walletData))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);