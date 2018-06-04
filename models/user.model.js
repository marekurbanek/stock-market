const mongoose = require('mongoose');

const user = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   username: {type: String, required: true, unique: true},
   password: {type: String, required: true},
   PLN: {type: Number, min: 0},
   FP: {type: Number, min: 0},
   FPL: {type: Number, min: 0},
   PGB: {type: Number, min: 0},
   FPC: {type: Number, min: 0},
   FPA: {type: Number, min: 0},
   DL24: {type: Number, min: 0},
});

module.exports = mongoose.model('User', user);