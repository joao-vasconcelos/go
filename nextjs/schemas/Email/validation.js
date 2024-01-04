import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: EMAIL */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  email: yup
    .string()
    .email('Please provide a valid email address.')
    .required('Please enter your TML email.')
    .transform((value) => value.replace(/  +/g, ' ').trim()),
});
