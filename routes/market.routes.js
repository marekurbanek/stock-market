const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Market = require('../models/market.model');
const request = require('request');

const ws = require('ws')
const PriceHistory = require('../models/priceHistory.model');

const initialMarket = new Market({
    _id: new mongoose.Types.ObjectId(),
    FP: 9999999,
    FPL: 9999999,
    PGB: 9999999,
    FPC: 9999999,
    FPA: 9999999,
    DL24: 9999999
})
initialMarket.save().then(() => console.log('Initial stock amounts were created'))

let priceHistoryId = null;
const initialPriceHistory = new PriceHistory({
    _id: new mongoose.Types.ObjectId(),
    FP: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    FPL: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    PGB: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    FPC: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    FPA: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    DL24: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
})

initialPriceHistory.save((err, priceHistory) => {
    console.log('Initial price history created')
    priceHistoryId = priceHistory._id;
})

const webSocket = new ws('ws://webtask.future-processing.com:8068/ws/stocks');
webSocket.on('open', function () {
    console.log('Connected to FP websocket');
});

webSocket.on('message', function (data, flags) {
    let response = JSON.parse(data);
    priceArray = response.Items.map(item => {
        return item.Price
    });
    PriceHistory.findById(priceHistoryId, (err, priceHistory) => {
        if (priceHistory !== null) {
            priceHistory['FP'].splice(0, 1);
            priceHistory['FP'].push(priceArray[0]);
            priceHistory['FPL'].splice(0, 1);
            priceHistory['FPL'].push(priceArray[1]);
            priceHistory['PGB'].splice(0, 1);
            priceHistory['PGB'].push(priceArray[2]);
            priceHistory['FPC'].splice(0, 1);
            priceHistory['FPC'].push(priceArray[3]);
            priceHistory['FPA'].splice(0, 1);
            priceHistory['FPA'].push(priceArray[4]);
            priceHistory['DL24'].splice(0, 1);
            priceHistory['DL24'].push(priceArray[5]);
            priceHistory.save((err, saved) => {
                console.log('Price history saved')
            })
        }

    })

});

router.get('/pricehistory', (req, res) => {
    PriceHistory.findById(priceHistoryId, (err, priceHistory) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).json({ priceHistory })
        }
    })
})

router.post('/buy', verifyToken, (req, res) => {
    //Verify User
    jwt.verify(req.token, 'superSecretKey', (err, authData) => {
        if (err) {
            return res.json({
                error: err,
                authorized: false
            })
        } else {
            // Get info about buy request
            const stockName = req.body.stockName
            const amountToBuy = req.body.amount
            const basicUnit = req.body.basicUnit
            let currentStockPrice = null
            // Get user
            User.findById(authData._id, (err, user) => {
                if (err) {
                    res.status(403).json({
                        error: 'User not found'
                    })
                } else {
                    //User found
                    const userMoney = user['PLN']

                    //Get current stock price
                    request('http://webtask.future-processing.com:8068/stocks?format=json', (err, response, body) => {
                        stockData = JSON.parse(body)
                        stockData.items.forEach(stock => {
                            if (stock.code === stockName) {
                                currentStockPrice = stock.price
                            }
                        })
                        const totalCost = currentStockPrice * amountToBuy
                        const totalAmount = amountToBuy * basicUnit

                        //Check if sell is possible - market amount and user money 
                        if (initialMarket[stockName] >= totalAmount && userMoney >= totalCost) {
                            //Substract from market and add to user 
                            user['PLN'] = user['PLN'] - totalCost;
                            user[stockName] = Number(user[stockName]) + Number(totalAmount)
                            user.save((err, userSaved) => {
                                console.log('userUpdated')
                            })
                            initialMarket[stockName] = initialMarket[stockName] - totalAmount;
                            initialMarket.save((err, marketSaved) => {
                                res.status(200).json({
                                    msg: 'Bought stocks successfully',
                                    error: false
                                })
                            })

                        }
                        else {
                            res.status(403).json({
                                msg: 'Stock amount to buy is bigger than amount avaliable on market or you don`t have enough money',
                                error: true
                            })
                        }
                    })
                }

            })
        }
    })
})

//SELL STOCKS
router.post('/sell', verifyToken, (req, res) => {
    jwt.verify(req.token, 'superSecretKey', (err, authData) => {
        if (err) {
            return res.json({
                error: err,
                authorized: false
            })
        } else {
            // Get info about sell request
            const stockName = req.body.stockName
            const amountToBuy = req.body.amount
            const basicUnit = req.body.basicUnit
            let currentStockPrice = null
            // Get user
            User.findById(authData._id, (err, user) => {
                if (err) {
                    res.status(403).json({
                        error: 'User not found'
                    })
                } else {
                    //User found
                    const userMoney = user['PLN']

                    //Get current stock price
                    request('http://webtask.future-processing.com:8068/stocks?format=json', (err, response, body) => {
                        stockData = JSON.parse(body)
                        stockData.items.forEach(stock => {
                            if (stock.code === stockName) {
                                currentStockPrice = stock.price
                            }
                        })
                        const totalCost = currentStockPrice * amountToBuy
                        const totalAmount = amountToBuy * basicUnit

                        //Check if user has proper amount to sell
                        if (user[stockName] >= totalAmount) {
                            // Add money do the user
                            user['PLN'] = user['PLN'] + totalCost;
                            //Substract stocks from user and add to market 
                            user[stockName] = Number(user[stockName]) - Number(totalAmount)
                            user.save((err, userSaved) => {
                                console.log('userUpdated')
                            })
                            initialMarket[stockName] = initialMarket[stockName] + totalAmount;
                            initialMarket.save((err, marketSaved) => {
                                res.status(200).json({
                                    msg: 'Selled stocks successfully',
                                    error: false
                                })
                            })

                        }
                        else {
                            res.json({
                                msg: 'You are trying to sell more stocks than you have in your wallet',
                                error: true
                            })
                        }
                    })
                }

            })
        }
    })
})

router.post('/wallet', verifyToken, (req, res) => {
    jwt.verify(req.token, 'superSecretKey', (err, authData) => {
        if (err) {
            return res.json({
                error: err,
                authorized: false
            })
        } else {
            //Find User
            const walletData = req.body.walletData
            User.findById(authData._id, (err, user) => {
                user['PLN'] = walletData[0].value
                user['FP'] = walletData[1].value
                user['FPL'] = walletData[2].value
                user['PGB'] = walletData[3].value
                user['FPC'] = walletData[4].value
                user['FPA'] = walletData[5].value
                user['DL24'] = walletData[6].value
                user.save((err, userSaved) => {
                    res.status(200).json({
                        message: 'Wallet changed success'
                    })

                })
            })
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    } else {
        res.status(403).json({
            error: 'Unauthorized access',
            authorized: false
        })
    }
}

module.exports = router;