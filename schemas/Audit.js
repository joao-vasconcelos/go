import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: AUDIT DOCUMENT */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  unique_code: yup
    .string()
    .min(6, 'Unique Code must have exactly ${min} characters')
    .max(6, 'Unique Code must have exactly ${max} characters')
    .required('Unique Code is a required field'),
  properties: yup.object({}),
});

/* * */
/* B. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    unique_code: {
      type: String,
      minlength: 6,
      maxlength: 6,
      default: '',
    },
    template: {},
    properties: {},
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Audit || mongoose.model('Audit', Schema);
