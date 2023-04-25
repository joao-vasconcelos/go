import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: USER */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  user_name: yup.string().max(50, 'Name must be no longer than ${max} characters.').required('Name is a required field.'),
  user_email: yup.string().email('Please provide a valid email address.').required('Email is a required field.'),
  user_phone: yup.string().max(13, 'Phone must be no longer than ${max} characters.'),
  //   permissions: yup.array(yup.string()),
});
