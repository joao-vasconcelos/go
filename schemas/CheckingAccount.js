/* * * * * */
/* SCHEMA: CHECKING ACCOUNT */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for Yup ["CheckingAccount"] Object */
export default yup.object({
  title: yup
    .string()
    .min(2, 'Title must have at least ${min} characters')
    .max(30, 'Title must be no longer than ${max} characters')
    .required('Title is a required field'),
  client_name: yup
    .string()
    .min(2, 'Client Name must have at least ${min} characters')
    .max(30, 'Client Name must be no longer than ${max} characters')
    .required('Client Name is a required field'),
  tax_region: yup
    .string()
    .matches(/^$|^[a-zA-Z]{2}$/, 'Tax Region must be exactly 2 letters (ex: PT, NL)')
    .uppercase(),
  tax_number: yup
    .string()
    .matches(/^$|^[0-9]{9}$/, 'Tax Number must be exactly 9 numbers (ex: 125 321 978)')
    .transform((value) => value.replace(/\s+/g, '')),
});
