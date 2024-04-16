/* * */

import * as yup from 'yup';

/* * */

export const ReportSalesValidation = yup.object({
  agency_code: yup.string().nullable(),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
});
