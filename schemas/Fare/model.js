import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    fare_id: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    fare_short_name: {
      type: String,
      maxlength: 50,
    },
    fare_long_name: {
      type: String,
      maxlength: 50,
    },
    price: {
      type: String,
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
    agency_id: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Agency || mongoose.model('Agency', Schema);
