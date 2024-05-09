'use client';

/* * */

import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ReportRevenueDefault, ReportRevenueMultipliersDefault } from '@/schemas/Report/Revenue/default';
import { ReportRevenueValidation, ReportRevenueMultipliersValidation } from '@/schemas/Report/Revenue/validation';
import { useForm, yupResolver } from '@mantine/form';

/* * */

// 1.
// SETUP INITIAL STATE

const initialRequestState = {
	//
	is_loading: false,
	is_success: false,
	is_error: false,
	//
	agency_code: null,
	start_date: null,
	end_date: null,
	//
	summary_onboard: null,
	summary_prepaid: null,
	summary_frequent: null,
	//
};

const initialDetailsState = {
	//
	is_loading: false,
	is_success: false,
	is_error: false,
	//
};

/* * */

// 2.
// CREATE CONTEXTS

const ReportsExplorerRevenueContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useReportsExplorerRevenueContext() {
	return useContext(ReportsExplorerRevenueContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function ReportsExplorerRevenueContextProvider({ children }) {
	//

	//
	// A. Setup state

	const [requestState, setRequestState] = useState(initialRequestState);
	const [detailsState, setDetailsState] = useState(initialDetailsState);

	//
	// C. Setup form

	const formState = useForm({
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(ReportRevenueValidation),
		initialValues: ReportRevenueDefault,
	});

	const multipliersState = useForm({
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(ReportRevenueMultipliersValidation),
		initialValues: ReportRevenueMultipliersDefault,
	});

	//
	// C. Setup actions

	const clearAllData = useCallback(async () => {
		setRequestState(initialRequestState);
	}, []);

	const getRequestBodyFormatted = useCallback(() => {
		if (!formState.values.agency_code || !formState.values.start_date || !formState.values.end_date) return {};
		// Parse request body
		return {
			agency_code: formState.values.agency_code,
			start_date: parseDate(formState.values.start_date),
			end_date: parseDate(formState.values.end_date),
		};
	}, [formState.values.agency_code, formState.values.end_date, formState.values.start_date]);

	const fetchSummaries = useCallback(async () => {
		try {
			// Return empty if filters are empty
			if (!formState.values.agency_code || !formState.values.start_date || !formState.values.end_date) return;
			// Update state to include request details
			setRequestState({ ...initialRequestState, is_loading: true });
			// Parse request body
			const requestBody = getRequestBodyFormatted();
			// Fetch the trips summary
			const reportValues = await Promise.all([
				API({ service: 'reports/revenue/onboard', operation: 'summary', method: 'POST', body: requestBody }),
				API({ service: 'reports/revenue/prepaid', operation: 'summary', method: 'POST', body: requestBody }),
				API({ service: 'reports/revenue/frequent', operation: 'summary', method: 'POST', body: requestBody }),
			]);
			// Update state to indicate progress
			setRequestState({ ...initialRequestState, is_success: true, summary_onboard: reportValues[0], summary_prepaid: reportValues[1], summary_frequent: reportValues[2] });
			//
		} catch (error) {
			setRequestState({ ...initialRequestState, is_error: error.message });
		}
	}, [formState.values.agency_code, formState.values.end_date, formState.values.start_date, getRequestBodyFormatted]);

	const downloadOnboardDetail = useCallback(async () => {
		try {
			setDetailsState((prev) => ({ ...prev, is_loading: true, is_error: false }));
			const requestBody = getRequestBodyFormatted();
			const responseBlob = await API({ service: 'reports/revenue/onboard', operation: 'detail', method: 'POST', body: requestBody, parseType: 'blob' });
			const objectURL = URL.createObjectURL(responseBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = 'report.csv';
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setDetailsState((prev) => ({ ...prev, is_loading: false, is_error: false }));
		} catch (error) {
			setDetailsState((prev) => ({ ...prev, is_loading: false, is_error: error.message }));
		}
	}, [getRequestBodyFormatted]);

	const downloadPrepaidDetail = useCallback(async () => {
		try {
			setDetailsState((prev) => ({ ...prev, is_loading: true, is_error: false }));
			const requestBody = getRequestBodyFormatted();
			const responseBlob = await API({ service: 'reports/revenue/prepaid', operation: 'detail', method: 'POST', body: requestBody, parseType: 'blob' });
			const objectURL = URL.createObjectURL(responseBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = 'report.csv';
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setDetailsState((prev) => ({ ...prev, is_loading: false, is_error: false }));
		} catch (error) {
			setDetailsState((prev) => ({ ...prev, is_loading: false, is_error: error.message }));
		}
	}, [getRequestBodyFormatted]);

	const downloadFrequentDetail = useCallback(async () => {
		try {
			setDetailsState((prev) => ({ ...prev, is_loading: true, is_error: false }));
			const requestBody = getRequestBodyFormatted();
			const responseBlob = await API({ service: 'reports/revenue/frequent', operation: 'detail', method: 'POST', body: requestBody, parseType: 'blob' });
			const objectURL = URL.createObjectURL(responseBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = 'report.csv';
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setDetailsState((prev) => ({ ...prev, is_loading: false, is_error: false }));
		} catch (error) {
			setDetailsState((prev) => ({ ...prev, is_loading: false, is_error: error.message }));
		}
	}, [getRequestBodyFormatted]);

	//
	// E. Setup context object

	const contextObject = useMemo(
		() => ({
			//
			form: formState,
			request: requestState,
			multipliers: multipliersState,
			details: detailsState,
			//
			clearAllData: clearAllData,
			//
			getRequestBodyFormatted: getRequestBodyFormatted,
			//
			fetchSummaries: fetchSummaries,
			//
			downloadOnboardDetail: downloadOnboardDetail,
			downloadPrepaidDetail: downloadPrepaidDetail,
			downloadFrequentDetail: downloadFrequentDetail,
			//
		}),
		[formState, requestState, multipliersState, detailsState, clearAllData, getRequestBodyFormatted, fetchSummaries, downloadOnboardDetail, downloadPrepaidDetail, downloadFrequentDetail],
	);

	//
	// D. Return provider

	return <ReportsExplorerRevenueContext.Provider value={contextObject}>{children}</ReportsExplorerRevenueContext.Provider>;

	//
}