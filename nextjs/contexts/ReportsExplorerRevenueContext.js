'use client';

/* * */

import { ReportRevenueDefault, ReportRevenueMultipliersDefault } from '@/schemas/Report/Revenue/default';
import { ReportRevenueMultipliersValidation, ReportRevenueValidation } from '@/schemas/Report/Revenue/validation';
import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { useForm, yupResolver } from '@mantine/form';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* * */

// 1.
// SETUP INITIAL STATE

const initialRequestState = {
	//
	agency_code: null,
	end_date: null,
	is_error: false,
	//
	is_loading: false,
	is_success: false,
	start_date: null,
	summary_frequent: null,
	//
	summary_onboard: null,
	summary_prepaid: null,
	//
};

const initialDetailsState = {
	is_error: false,
	//
	is_loading: false,
	is_success: false,
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
		clearInputErrorOnChange: true,
		initialValues: ReportRevenueDefault,
		validate: yupResolver(ReportRevenueValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const multipliersState = useForm({
		clearInputErrorOnChange: true,
		initialValues: ReportRevenueMultipliersDefault,
		validate: yupResolver(ReportRevenueMultipliersValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
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
			end_date: parseDate(formState.values.end_date),
			start_date: parseDate(formState.values.start_date),
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
				API({ body: requestBody, method: 'POST', operation: 'summary', service: 'reports/revenue/onboard' }),
				API({ body: requestBody, method: 'POST', operation: 'summary', service: 'reports/revenue/prepaid' }),
				API({ body: requestBody, method: 'POST', operation: 'summary', service: 'reports/revenue/frequent' }),
			]);
			// Update state to indicate progress
			setRequestState({ ...initialRequestState, is_success: true, summary_frequent: reportValues[2], summary_onboard: reportValues[0], summary_prepaid: reportValues[1] });
			//
		}
		catch (error) {
			setRequestState({ ...initialRequestState, is_error: error.message });
		}
	}, [formState.values.agency_code, formState.values.end_date, formState.values.start_date, getRequestBodyFormatted]);

	const downloadOnboardDetail = useCallback(async () => {
		try {
			setDetailsState(prev => ({ ...prev, is_error: false, is_loading: true }));
			const requestBody = getRequestBodyFormatted();
			const responseBlob = await API({ body: requestBody, method: 'POST', operation: 'detail', parseType: 'blob', service: 'reports/revenue/onboard' });
			const objectURL = URL.createObjectURL(responseBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = 'report.csv';
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setDetailsState(prev => ({ ...prev, is_error: false, is_loading: false }));
		}
		catch (error) {
			setDetailsState(prev => ({ ...prev, is_error: error.message, is_loading: false }));
		}
	}, [getRequestBodyFormatted]);

	const downloadPrepaidDetail = useCallback(async () => {
		try {
			setDetailsState(prev => ({ ...prev, is_error: false, is_loading: true }));
			const requestBody = getRequestBodyFormatted();
			const responseBlob = await API({ body: requestBody, method: 'POST', operation: 'detail', parseType: 'blob', service: 'reports/revenue/prepaid' });
			const objectURL = URL.createObjectURL(responseBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = 'report.csv';
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setDetailsState(prev => ({ ...prev, is_error: false, is_loading: false }));
		}
		catch (error) {
			setDetailsState(prev => ({ ...prev, is_error: error.message, is_loading: false }));
		}
	}, [getRequestBodyFormatted]);

	const downloadFrequentDetail = useCallback(async () => {
		try {
			setDetailsState(prev => ({ ...prev, is_error: false, is_loading: true }));
			const requestBody = getRequestBodyFormatted();
			const responseBlob = await API({ body: requestBody, method: 'POST', operation: 'detail', parseType: 'blob', service: 'reports/revenue/frequent' });
			const objectURL = URL.createObjectURL(responseBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = 'report.csv';
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setDetailsState(prev => ({ ...prev, is_error: false, is_loading: false }));
		}
		catch (error) {
			setDetailsState(prev => ({ ...prev, is_error: error.message, is_loading: false }));
		}
	}, [getRequestBodyFormatted]);

	//
	// E. Setup context object

	const contextObject = useMemo(
		() => ({
			//
			clearAllData: clearAllData,
			details: detailsState,
			downloadFrequentDetail: downloadFrequentDetail,
			//
			downloadOnboardDetail: downloadOnboardDetail,
			downloadPrepaidDetail: downloadPrepaidDetail,
			//
			fetchSummaries: fetchSummaries,
			//
			form: formState,
			//
			getRequestBodyFormatted: getRequestBodyFormatted,
			multipliers: multipliersState,
			request: requestState,
			//
		}),
		[formState, requestState, multipliersState, detailsState, clearAllData, getRequestBodyFormatted, fetchSummaries, downloadOnboardDetail, downloadPrepaidDetail, downloadFrequentDetail],
	);

	//
	// D. Return provider

	return <ReportsExplorerRevenueContext.Provider value={contextObject}>{children}</ReportsExplorerRevenueContext.Provider>;

	//
}
