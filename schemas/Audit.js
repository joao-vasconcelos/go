/* * * * * */
/* SCHEMA: AUDIT */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Audit"] Object */
export default yup.object({
  unique_code: yup
    .string()
    .min(6, 'Unique Code must have exactly ${min} characters')
    .max(6, 'Unique Code must have exactly ${max} characters')
    .required('Unique Code is a required field'),
  first_name: yup.string().max(10, 'Name must be no longer than ${max} characters'),
});
