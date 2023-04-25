import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    agency_id: {
      type: String,
      minlength: 2,
      maxlength: 2,
      unique: true,
    },
    agency_name: {
      type: String,
      maxlength: 50,
    },
    agency_timezone: {
      type: String,
      maxlength: 50,
    },
    agency_lang: {
      type: String,
      maxlength: 50,
    },
    agency_phone: {
      type: String,
      maxlength: 50,
    },
    agency_email: {
      type: String,
      maxlength: 50,
    },
    agency_url: {
      type: String,
      maxlength: 50,
    },
    agency_fare_url: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Agency || mongoose.model('Agency', Schema);
