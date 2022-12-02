/* * * * * */
/* SCHEMA: EMAIL */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Email"] Object */
export default yup.object({
  email: yup.string().email('Please provide a valid email address.').required('Please enter your TML email.'),
});
