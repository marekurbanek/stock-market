import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as actions from './index';

export const tryLogin = (login, password) => {
    return dispatch => {
        const authData = {
            username: login,
            password: password
        }
        axios.post('/users/signin', authData)
            .then(response => {
                // console.log(response)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                dispatch(loginSuccess(response.data))
                dispatch(authTrue(response.data))
                dispatch(actions.displayMessage({content: 'Logged in successfully', error: false}))
            })
            .catch(err => {
                console.log(err)
                dispatch(loginFailed(err))
                dispatch(actions.displayMessage({content: 'Invalid username or password, try again or register new account', error: true}))
            })
    }
}

export const checkAuthentication = () => {
    return dispatch => {
        // console.log('Checking Authentication')

        var authOptions = {
            method: 'POST',
            url: '/auth/checkUser',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            json: true
          };

        axios(authOptions)
            .then(response => {
                // console.log(response.data)
                if(response.data.authorized){
                    // console.log('User Authorized')
                    dispatch(authTrue(response.data.authData))
                }else{
                    dispatch(authFalse())
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}

export const authTrue = (authData) => {
    return{
        type: actionTypes.AUTH_TRUE,
        username: authData.username
    }
}
export const authFalse = () => {
    return{
        type: actionTypes.AUTH_FALSE
    }
}

export const loginSuccess = (userData) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        token: userData.token,
        username: userData.username
    }
}

export const loginFailed = (err) => {
    return {
        type: actionTypes.LOGIN_FAILED,
        error: err
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    return {
        type: actionTypes.LOGOUT
    };
};

export const tryRegister = (login, password, walletData) => {
    return dispatch => {
        const authData = {
            username: login,
            password: password,
            walletData
        }
        axios.post('/users/signup', authData)
            .then(response => {
                dispatch(registerSuccess(response.data))
                dispatch(actions.displayMessage({content: 'Registered successfully, you can log in now', error: false}))
            })
            .catch(err => {
                console.log(err)
                dispatch(loginFailed(err))
                dispatch(actions.displayMessage({content: 'Register failed, try again with another username', error: true}))
            })
    }
}

export const registerSuccess = (data) => {
    return{
        type: actionTypes.REGISTER_SUCCESS,
    }
}