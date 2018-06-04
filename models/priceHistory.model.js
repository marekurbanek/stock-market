const mongoose = require('mongoose');

const priceHistory = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   FP: [Number],
   FPL: [Number],
   PGB: [Number],
   FPC: [Number],
   FPA: [Number],
   DL24: [Number],
});

module.exports = mongoose.model('priceHistory', priceHistory);