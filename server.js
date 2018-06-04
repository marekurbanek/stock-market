const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.route');
const marketRoutes = require('./routes/market.routes');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

mongoose.connect('mongodb://admin:password1@ds247430.mlab.com:47430/stock-market-fp');

const PORT = 3005;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use('/users', userRoutes);
app.use('/market', marketRoutes);

app.use('/static', express.static(path.join(__dirname, 'client/build')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.post('/auth/checkUser', verifyToken, (req, res) => {
    jwt.verify(req.token, 'superSecretKey', (err, authData) => {
        if (err) {
            return res.json({
                error: err,
                authorized: false
            })
        } else {
            res.json({
                authorized: true,
                authData
            })
        }
    })
});


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

app.listen(process.env.PORT || PORT, function () {
    console.log('Server is running on Port', PORT);
});