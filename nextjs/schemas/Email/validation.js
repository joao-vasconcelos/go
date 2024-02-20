/* * */

import * as yup from 'yup';

/* * */

export const EmailValidation = yup.object({
  email: yup
    .string()
    .email('Please provide a valid email address.')
    .required('Please enter your TML email.')
    .transform((value) => value.replace(/  +/g, ' ').trim()),
});
