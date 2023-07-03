const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Municipality */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 4,
      unique: true,
    },
    prefix: {
      type: String,
      maxlength: 2,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    district: {
      type: String,
      maxlength: 2,
    },
    region: {
      type: String,
      maxlength: 5,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Municipality || mongoose.model('Municipality', Schema);
