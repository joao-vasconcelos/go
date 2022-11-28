/* * * * * */
/* SCHEMA: CUSTOMER */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Customer"] Object */
export default yup.object({
  first_name: yup
    .string()
    .min(2, 'First Name must have at least ${min} characters')
    .max(30, 'First Name must be no longer than ${max} characters')
    .required('First Name is a required field'),
  last_name: yup.string().max(30, 'Last Name must be no longer than ${max} characters'),
  tax_region: yup
    .string()
    .matches(/^$|^[a-zA-Z]{2}$/, 'Tax Region must be exactly 2 letters (ex: PT, NL)')
    .uppercase(),
  tax_number: yup
    .string()
    .matches(/^$|^[0-9]{9}$/, 'Tax Number must be exactly 9 numbers (ex: 125 321 978)')
    .transform((value) => value.replace(/\s+/g, '')),
  contact_email: yup.string().email(),
  send_invoices: yup.boolean().default(false),
  reference: yup.string('Reference must be a string').max(30, 'Reference must be no longer than 30 characters'),
  birthday: yup.string().ensure(),
});
