import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: LINE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    short_name: {
      type: String,
      maxlength: 50,
    },
    long_name: {
      type: String,
      maxlength: 50,
    },
    transport_type: {
      type: Boolean,
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
    line_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineType',
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
export const Model = mongoose?.models?.Line || mongoose.model('Line', Schema);
