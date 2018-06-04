import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token: null,
    username: null,
    error: null,
    authenticated: null,
    registerSuccess: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return{
                ...state,
                token: action.token,
                username: action.username,
                registerSuccess: null
            }
        case actionTypes.AUTH_TRUE:
            return{
                ...state,
                authenticated: true,
                registerSuccess: null,
                username: action.username
            }
        case actionTypes.AUTH_FALSE:
            return{
                ...state,
                authenticated: false
            }
        case actionTypes.LOGOUT:
            return{
                ...state,
                token: null,
                username: null,
                authenticated: null,
                error: null
            }
        case actionTypes.REGISTER_SUCCESS:
            return{
                ...state,
                registerSuccess: true
            }
        default: return state;
    }
}

export default reducer;