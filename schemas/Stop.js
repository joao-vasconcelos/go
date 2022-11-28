/* * * * * */
/* SCHEMA: STOP */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Stop"] Object */
export default yup.object({
  unique_code: yup
    .string()
    .min(6, 'Unique Code must have exactly ${min} characters')
    .max(6, 'Unique Code must have exactly ${max} characters')
    .required('Unique Code is a required field'),
  name: yup.string().max(30, 'Last Name must be no longer than ${max} characters'),
  short_name: yup.string().max(30, 'Last Name must be no longer than ${max} characters'),
  description: yup.string().max(30, 'Last Name must be no longer than ${max} characters'),
  latitude: yup.string().max(30, 'Last Name must be no longer than ${max} characters'),
  longitude: yup.string().max(30, 'Last Name must be no longer than ${max} characters'),
});
