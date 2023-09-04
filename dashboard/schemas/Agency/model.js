import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const AgencySchema = new mongoose.Schema(
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
    price_per_km: {
      type: Number,
    },
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const AgencyModel = mongoose?.models?.Agency || mongoose.model('Agency', AgencySchema);
