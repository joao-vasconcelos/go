import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* SCHEMA: AUDIT TEMPLATE */
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
  first_name: yup.string().max(10, 'Name must be no longer than ${max} characters'),
});

/* * */
/* B. MongoDB Model Schema */
export const Model =
  mongoose?.models?.AuditTemplate ||
  mongoose.model(
    'AuditTemplate',
    new mongoose.Schema(
      {
        unique_code: {
          type: String,
          minlength: 6,
          maxlength: 6,
        },
        first_name: {
          type: String,
          maxlength: 50,
        },
      },
      { timestamps: true }
    )
  );
