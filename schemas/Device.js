/* * * * * */
/* SCHEMA: DEVICE */
/* * */

/* * */
/* IMPORTS */
import { z } from 'zod';

/* * */
/* Schema for ZOD ["CheckingAccount"] Object */
export default z.object({
  title: z
    .string({ message: 'Title must be a string' })
    .min(2, { message: 'Title must be 2 or more characters long' })
    .max(30, { message: 'Title must be no longer than 30 characters' }),
  location: z.string().min(1, 'Location is required'),
  users: z.array(z.string()).min(1, 'At least 1 user is required'),
  layout: z.string().min(1, 'Layout is required'),
  discounts: z.array(z.string()).optional(),
  checking_accounts: z.array(z.string()).optional(),
});
