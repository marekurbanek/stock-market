import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as actions from './index';

export const setStockPrices = (stockData) => {
    return {
        type: actionTypes.SET_STOCK_PRICES,
        stockData: JSON.parse(stockData)
    }
}

export const getWalletData = () => {
    return dispatch => {
        const authOptions = {
            method: 'GET',
            url: 'users/market/wallet',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            json: true
        };

        axios(authOptions)
            .then(response => {
                dispatch(setWalletData(response.data.walletData))
            })
            .catch(err => {
                console.log(err)
            })
    }
}

export const setWalletData = (walletData) => {
    return {
        type: actionTypes.SET_WALLET_DATA,
        walletData
    }
}

export const buyStock = (stockName, amount, basicUnit) => {
    return dispatch => {
        const authOptions = {
            method: 'POST',
            url: 'market/buy',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            data: {
                stockName,
                amount,
                basicUnit
            },
            json: true
        };

        axios(authOptions)
            .then(response => {
                dispatch(getWalletData())
                dispatch(actions.displayMessage({ content: response.data.msg, error: response.data.error }))
            })
            .catch(err => {
                dispatch(actions.displayMessage({ content: 'Unable to buy stocks, you don`t have enough money or there isn`t enough stocks in the market', error: true }))
                console.log(err)
            })
    }
}

export const sellStock = (stockName, amount, basicUnit) => {
    return dispatch => {
        const authOptions = {
            method: 'POST',
            url: 'market/sell',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            data: {
                stockName,
                amount,
                basicUnit
            },
            json: true
        };

        axios(authOptions)
            .then(response => {
                dispatch(getWalletData())
                dispatch(actions.displayMessage({ content: response.data.msg, error: response.data.error }))
            })
            .catch(err => {
                console.log(err)
                dispatch(actions.displayMessage({ content: 'You don`t have enough stocks to sell', error: true }))
            })
    }
}

export const saveUserChanges = (walletData) => {
    return dispatch => {
        const authOptions = {
            method: 'POST',
            url: 'market/wallet',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            data: {
                walletData
            },
            json: true
        };

        axios(authOptions)
            .then(response => {
                dispatch(getWalletData())
                dispatch(actions.displayMessage({ content: 'User changed successfully', error: false }))
            })
            .catch(err => {
                console.log(err)
                dispatch(actions.displayMessage({ content: 'Wrong user data, please try again', error: true }))
            })
    }
}

export const getPriceHistory = (stockName) => {
    return dispatch => {
        axios.get('/market/pricehistory')
            .then(response => {
                dispatch(setPriceHistory(response.data.priceHistory, stockName))
                // dispatch(actions.displayMessage({content: 'Successfully generated price history', error: false}))
            })
            .catch(err => {
                console.log(err)
                dispatch(actions.displayMessage({ content: 'Couldn`t get price history', error: true }))
            })
    }
}

export const setPriceHistory = (priceHistory, stockName) => {
    return {
        type: actionTypes.SET_PRICE_HISTORY,
        stockName,
        priceHistory
    }
}