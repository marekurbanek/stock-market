import * as actionTypes from './actionTypes';

export const displayMessage = (msg) => {
    return dispatch => {
        dispatch(showMessage(msg))
        setTimeout( ()=>{
            dispatch(hideMessage())
            
        }, 4000)
    }
}

export const showMessage = (msg) => {
    return {
        type: actionTypes.DISPLAY_MESSAGE,
        msg
    }
}

export const hideMessage = () => {
    return {
        type: actionTypes.CLEAR_MESSAGE
    }
}
