const mongoose = require('mongoose');

/* * */
/* DOCUMENT TYPE: Line */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 5,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 150,
    },
    short_name: {
      type: String,
      maxlength: 5,
    },
    transport_type: {
      type: Number,
    },
    circular: {
      type: Boolean,
    },
    school: {
      type: Boolean,
    },
    continuous: {
      type: Boolean,
    },
    typology: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Typology',
    },
    fare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fare',
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
    },
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
module.exports = mongoose?.models?.Line || mongoose.model('Line', Schema);
