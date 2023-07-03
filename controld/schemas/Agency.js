const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Agency */
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
    timezone: {
      type: String,
      maxlength: 50,
    },
    lang: {
      type: String,
      maxlength: 50,
    },
    phone: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      maxlength: 50,
    },
    url: {
      type: String,
      maxlength: 50,
    },
    fare_url: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Agency || mongoose.model('Agency', Schema);
