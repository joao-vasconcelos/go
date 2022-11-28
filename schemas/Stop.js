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
  name: yup.string().max(50, 'Name must be no longer than ${max} characters').required('Name is a required field'),
  short_name: yup
    .string()
    .max(15, 'Short Name must be no longer than ${max} characters')
    .required('Short Name is a required field'),
  description: yup.string().max(300, 'Description must be no longer than ${max} characters'),
  latitude: yup.number().required('Latitude is a required field'),
  longitude: yup.number().required('Longitude is a required field'),
});
