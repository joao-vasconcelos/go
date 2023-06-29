const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Calendar */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 100,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 50,
    },
    is_holiday: {
      type: Boolean,
    },
    dates: [
      {
        type: String,
        maxlength: 8,
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Calendar || mongoose.model('Calendar', Schema);
