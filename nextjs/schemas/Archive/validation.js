/* * */

import * as yup from 'yup';

/* * */

export const ArchiveValidation = yup.object({
  //
  code: yup.string().max(100),
  //   status: yup.string().max(100),
  //   //
  //   agency: yup.string().max(100),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
  //
  //   reference_plan: yup.string().max(100),
  //   offer_plan: yup.string().max(100),
  //   operation_plan: yup.string().max(100),
  //   apex_files: yup.string().max(100),
  //   //
  //   is_locked: yup.boolean(),
});
