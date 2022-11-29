/* * * * * */
/* SCHEMA: SURVEY */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Survey"] Object */
export default yup.object({
  unique_code: yup
    .string()
    .min(6, 'Unique Code must have exactly ${min} characters')
    .max(6, 'Unique Code must have exactly ${max} characters')
    .required('Unique Code is a required field'),
  name: yup.string().max(50, 'Name must be no longer than ${max} characters'),
  short_name: yup.string().max(15, 'Short Name must be no longer than ${max} characters'),
  description: yup.string().max(300, 'Description must be no longer than ${max} characters'),
});
