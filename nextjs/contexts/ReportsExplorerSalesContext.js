'use client';

/* * */

import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ReportSalesDefault } from '@/schemas/Report/Sales/default';
import { ReportSalesValidation } from '@/schemas/Report/Sales/validation';
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
  summary_encm: null,
  //
};

/* * */

// 2.
// CREATE CONTEXTS

const ReportsExplorerSalesContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useReportsExplorerSalesContext() {
  return useContext(ReportsExplorerSalesContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function ReportsExplorerSalesContextProvider({ children }) {
  //

  //
  // A. Setup state

  const [requestState, setRequestState] = useState(initialRequestState);

  //
  // C. Setup form

  const formState = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(ReportSalesValidation),
    initialValues: ReportSalesDefault,
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

  const fetchSummary = useCallback(async () => {
    try {
      // Return empty if filters are empty
      if (!formState.values.agency_code || !formState.values.start_date || !formState.values.end_date) return;
      // Update state to include request details
      setRequestState({ ...initialRequestState, is_loading: true });
      // Parse request body
      const requestBody = {
        agency_code: formState.values.agency_code,
        start_date: parseDate(formState.values.start_date),
        end_date: parseDate(formState.values.end_date),
      };
      // Fetch the trips summary
      const summaryOnboard = await API({ service: 'reports/sales/onboard', operation: 'summary', method: 'POST', body: requestBody });
      const summaryEncm = null; // await API({ service: 'reports/sales/encm', operation: 'summary', method: 'POST', body: requestBody });
      // Update state to indicate progress
      setRequestState({ ...initialRequestState, is_success: true, summary_onboard: summaryOnboard, summary_encm: summaryEncm });
      //
    } catch (error) {
      // Update state to indicate progress
      setRequestState({ ...initialRequestState, is_error: true });
    }
  }, [formState.values.agency_code, formState.values.end_date, formState.values.start_date]);

  //
  // E. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      form: formState,
      request: requestState,
      //
      clearAllData: clearAllData,
      //
      getRequestBodyFormatted: getRequestBodyFormatted,
      //
      fetchSummary: fetchSummary,
      //
    }),
    [formState, requestState, clearAllData, getRequestBodyFormatted, fetchSummary]
  );

  //
  // D. Return provider

  return <ReportsExplorerSalesContext.Provider value={contextObject}>{children}</ReportsExplorerSalesContext.Provider>;

  //
}
