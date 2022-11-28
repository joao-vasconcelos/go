/* * * * * */
/* SCHEMA: USER */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for ZOD ["CheckingAccount"] Object */
export default yup.object({
  name: yup
    .string()
    .min(2, 'Name must have at least ${min} characters')
    .max(30, 'Name must be no longer than ${max} characters')
    .required('Name is a required field'),
  role: yup
    .string()
    .min(2, 'Role must have at least ${min} characters')
    .max(30, 'Role must be no longer than ${max} characters')
    .required('Role is a required field'),
  pwd: yup.string().matches(/^[0-9]{4}$/, 'Password must be exactly 4 numbers (ex: 1234)'),
});
