/* * */

import * as yup from 'yup';

/* * */

export const UserValidation = yup.object({
  name: yup
    .string()
    .max(50, 'Name must be no longer than ${max} characters.')
    .required('Name is a required field.')
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  email: yup
    .string()
    .email('Please provide a valid email address.')
    .required('Email is a required field.')
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  phone: yup
    .string()
    .max(13, 'Phone must be no longer than ${max} characters.')
    .transform((value) => value.replace(/  +/g, ' ').trim()),
  //   permissions: yup.array(yup.string()),
});
