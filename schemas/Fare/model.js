import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: FARE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    fare_code: {
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
    agencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
      },
    ],
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Fare || mongoose.model('Fare', Schema);
