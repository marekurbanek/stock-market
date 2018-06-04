import * as actionTypes from '../actions/actionTypes';

const initialState = {
    stockData: null,
    walletData: null,
    msg: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_STOCK_PRICES:
            return {
                ...state,
                stockData: action.stockData
            }
        case actionTypes.SET_WALLET_DATA:
            return{
                ...state,
                walletData: action.walletData
            }
        case actionTypes.DISPLAY_MESSAGE:
            return{
                ...state,
                msg: action.msg
            }
        case actionTypes.CLEAR_MESSAGE:
            return{
                ...state,
                msg: null
            }
        case actionTypes.SET_PRICE_HISTORY:
            //Get prices array and modify, so chart can be displayed
            const newHistory = action.priceHistory[action.stockName]
            let dataArray = []
            newHistory.forEach(price => {
                dataArray.push({value: price})
            })
            return{
                ...state,
                priceHistory: dataArray
            }
        default: return state;
    }
}

export default reducer;