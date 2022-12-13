import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* SCHEMA: SURVEY DOCUMENT */
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
  name: yup.string().max(50, 'Name must be no longer than ${max} characters'),
  short_name: yup.string().max(15, 'Short Name must be no longer than ${max} characters'),
  description: yup.string().max(300, 'Description must be no longer than ${max} characters'),
});

/* * */
/* B. MongoDB Model Schema */
export const Model =
  mongoose?.models?.Survey ||
  mongoose.model(
    'Survey',
    new mongoose.Schema({
      unique_code: {
        type: String,
        minlength: 6,
        maxlength: 6,
      },
      name: {
        type: String,
        maxlength: 50,
      },
      short_name: {
        type: String,
        maxlength: 15,
      },
      description: {
        type: String,
        maxlength: 300,
      },
    })
  );
