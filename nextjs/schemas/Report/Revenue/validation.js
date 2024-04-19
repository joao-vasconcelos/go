/* * */

import * as yup from 'yup';

/* * */

export const ReportRevenueValidation = yup.object({
  agency_code: yup.string().nullable(),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
});

/* * */

export const ReportRevenueMultipliersValidation = yup.object({
  prepaid: yup.number().min(0).max(1),
  frequent: yup.number().min(0).max(500),
});
