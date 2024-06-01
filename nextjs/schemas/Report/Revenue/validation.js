/* * */

import * as yup from 'yup';

/* * */

export const ReportRevenueValidation = yup.object({
	agency_code: yup.string().nullable(),
	end_date: yup.date().nullable(),
	start_date: yup.date().nullable(),
});

/* * */

export const ReportRevenueMultipliersValidation = yup.object({
	frequent: yup.number().min(0).max(500),
	prepaid: yup.number().min(0).max(1),
});
