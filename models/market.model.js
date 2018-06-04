const mongoose = require('mongoose');

const market = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   FP: {type: Number, min: 0},
   FPL: {type: Number, min: 0},
   PGB: {type: Number, min: 0},
   FPC: {type: Number, min: 0},
   FPA: {type: Number, min: 0},
   DL24: {type: Number, min: 0},
});

module.exports = mongoose.model('market', market);