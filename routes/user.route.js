const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                PLN: req.body.walletData[0].value,
                FP: req.body.walletData[1].value,
                FPL: req.body.walletData[2].value,
                PGB: req.body.walletData[3].value,
                FPC: req.body.walletData[4].value,
                FPA: req.body.walletData[5].value,
                DL24: req.body.walletData[6].value
            });
            user.save().then(function (result) {
                console.log(result);
                res.status(200).json({
                    success: 'New user has been created'
                });
            }).catch(error => {
                res.status(500).json({
                    error: err
                });
            });
        }
    });
});

router.post('/signin', function (req, res) {
    User.findOne({ username: req.body.username })
        .exec()
        .then(function (user) {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (err) {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
                if (result) {
                    jwt.sign({ username: user.username, _id: user._id }, 'superSecretKey', (err, token) => {
                        return res.status(200).json({
                            token,
                            username: user.username
                        })
                    })
                }
                else {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
            });
        })
        .catch(error => {
            res.status(401).json({
                error: 'Invalid user or password'
            });
        });;
});

router.get('/market/wallet', verifyToken, (req, res) => {
    jwt.verify(req.token, 'superSecretKey', (err, authData) => {
        if (err) {
            return res.json({
                error: err,
                authorized: false
            })
        } else {
            //Find user 
            User.findById(authData._id, (err, user) => {
                return res.status(200).json({
                    walletData: [
                        {
                            name: 'PLN',
                            amount: user.PLN
                        },
                        {
                            name: 'FP',
                            amount: user.FP
                        },
                        {
                            name: 'FPL',
                            amount: user.FPL
                        },
                        {
                            name: 'PGB',
                            amount: user.PGB
                        },
                        {
                            name: 'FPC',
                            amount: user.FPC
                        },
                        {
                            name: 'FPA',
                            amount: user.FPA
                        },
                        {
                            name: 'DL24',
                            amount: user.DL24
                        }
                    ]
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