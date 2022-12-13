import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* SCHEMA: USER DOCUMENT */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  email: yup.string().email('Please provide a valid email address.').required('Email is a required field.'),
  name: yup.string().max(50, 'Name must be no longer than ${max} characters.').required('Name is a required field.'),
  permissions: yup.array(yup.string()),
});

/* * */
/* B. MongoDB Model Schema */
export const Model =
  mongoose?.models?.User ||
  mongoose.model(
    'User',
    new mongoose.Schema({
      email: {
        type: String,
        maxlength: 50,
        unique: true,
      },
      name: {
        type: String,
        maxlength: 50,
      },
      permissions: [
        {
          type: String,
          maxlength: 50,
        },
      ],
      emailVerified: {
        type: String,
        maxlength: 15,
      },
    })
  );
