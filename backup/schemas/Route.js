const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Route */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 15,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 200,
    },
    path_type: {
      type: Number,
    },
    parent_line: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line',
    },
    patterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pattern',
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Route || mongoose.model('Route', Schema);
