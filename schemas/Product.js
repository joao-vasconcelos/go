/* * * * * */
/* SCHEMA: PRODUCT */
/* * */

/* * */
/* IMPORTS */
import { z } from 'zod';

/* * */
/* Schema for ZOD ["Product"] Object */
export default z.object({
  title: z
    .string({ message: 'Title must be a string' })
    .min(2, { message: 'Title must be 2 or more characters long' })
    .max(30, { message: 'Title must be no longer than 30 characters' }),
  short_title: z
    .string({ message: 'Short Title must be a string' })
    .max(15, { message: 'Short Title must be no longer than 15 characters' })
    .optional(),
  image: z
    .string({ message: 'Image must be a string' })
    .max(50, { message: 'Image must be no longer than 50 characters' })
    .optional(),
  description: z
    .string({ message: 'Description must be a string' })
    .max(250, { message: 'Description must be no longer than 250 characters' })
    .optional(),
  variations: z
    .array(
      z.object({
        title: z
          .string({ message: 'Variation Title must be a string' })
          .min(2, { message: 'Variation Title must be 2 or more characters long' })
          .max(50, { message: 'Variation Title must be no longer than 50 characters' }),
        price: z
          .union([z.string(), z.number()])
          .refine((value) => Number(value) >= 0, { message: 'Price cannot be negative' })
          .transform((value) => Number(value).toFixed(2)),
        tax_id: z.enum(['NOR', 'INT', 'RED'], { message: 'Tax ID must be either NOR, INT or RED' }).default('NOR'),
        apicbase: z
          .object({
            recipe_id: z.string().max(100).optional(),
          })
          .optional(),
      })
    )
    .nonempty(),
});
