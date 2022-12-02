/* * * * * */
/* SCHEMA: USER */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["User"] Object */
export default yup.object({
  email: yup.string().email('Please provide a valid email address.').required('Email is a required field.'),
  name: yup.string().max(50, 'Name must be no longer than ${max} characters.').required('Name is a required field.'),
});
