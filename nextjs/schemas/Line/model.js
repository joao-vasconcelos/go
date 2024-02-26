/* * */

import mongoose from 'mongoose';

/* * */

export const LineSchema = new mongoose.Schema(
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
      type: String,
      maxlength: 2,
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
    prepaid_fare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fare',
    },
    onboard_fares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fare',
      },
    ],
    interchange: {
      type: String,
      maxlength: 1,
      default: '0',
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
    is_locked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

/* * */

export const LineModel = mongoose?.models?.Line || mongoose.model('Line', LineSchema);
