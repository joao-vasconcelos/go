const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Fare */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    short_name: {
      type: String,
      maxlength: 50,
    },
    price: {
      type: Number,
      maxlength: 50,
    },
    currency_type: {
      type: String,
      maxlength: 50,
    },
    payment_method: {
      type: String,
      maxlength: 50,
    },
    transfers: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Fare || mongoose.model('Fare', Schema);
