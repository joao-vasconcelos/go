'use client';

/* * */

import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { JSONParser } from '@streamparser/json';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ReportSalesDefault } from '@/schemas/Report/Sales/default';
import { ReportSalesValidation } from '@/schemas/Report/Sales/validation';
import { useForm, yupResolver } from '@mantine/form';

/* * */

// 1.
// SETUP INITIAL STATE

const initialFormState = {
  //
  agency_code: null,
  start_date: null,
  end_date: null,
  //
  table_search_query: '',
  //
  time_distribution_graph_timeframe: '30',
  time_distribution_graph_type: 'line',
  event_order_type: 'insert_timestamp',
  //
};

const initialRequestState = {
  //
  is_loading: false,
  is_error: false,
  //
  agency_code: null,
  start_date: null,
  end_date: null,
  //
  summary: null,
  //
};

const initialSelectedTripState = {
  //
  trip_id: null,
  //
  line_id: null,
  route_id: null,
  pattern_id: null,
  //
  agency_code: null,
  //
  schedule_relationship: null,
  //
  found_vehicles: null,
  //
  event_animation_index: null,
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

  //   const [formState, setFormState] = useState(initialFormState);
  const [requestState, setRequestState] = useState(initialRequestState);
  const [selectedTripState, setSelectedTripState] = useState(initialSelectedTripState);

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

  const selectOperationDay = useCallback((operationDay) => {
    // setFormState((prev) => ({ ...prev, start_date: operationDay }));
    setRequestState((prev) => ({ ...prev, is_error: false }));
  }, []);

  const clearOperationDay = useCallback(() => {
    // setFormState((prev) => ({ ...prev, start_date: null }));
    setRequestState((prev) => ({ ...prev, is_error: false }));
  }, []);

  const selectAgencyId = useCallback((agencyId) => {
    // setFormState((prev) => ({ ...prev, agency_code: agencyId }));
    setRequestState((prev) => ({ ...prev, is_error: false }));
  }, []);

  const clearAgencyId = useCallback(() => {
    // setFormState((prev) => ({ ...prev, agency_code: null }));
    setRequestState((prev) => ({ ...prev, is_error: false }));
  }, []);

  const updateTableSearchQuery = useCallback((value) => {
    // setFormState((prev) => ({ ...prev, table_search_query: value }));
  }, []);

  const clearTableSearchQuery = useCallback(() => {
    // setFormState((prev) => ({ ...prev, table_search_query: '' }));
  }, []);

  const updateTimeDistributionGraphTimeframe = useCallback((value) => {
    // setFormState((prev) => ({ ...prev, time_distribution_graph_timeframe: value }));
  }, []);

  const updateTimeDistributionGraphType = useCallback((value) => {
    // setFormState((prev) => ({ ...prev, time_distribution_graph_type: value }));
  }, []);

  const updateEventOrderType = useCallback((value) => {
    // setFormState((prev) => ({ ...prev, event_order_type: value }));
  }, []);

  const updateEventAnimationIndex = useCallback((value) => {
    setSelectedTripState((prev) => ({ ...prev, event_animation_index: value }));
  }, []);

  const selectTripId = useCallback(
    (tripId) => {
      // Check if there are parsed unique trips
      if (!requestState.summary) return;
      // Retrieve the desired trip from the list of unique trips
      const foundTripData = requestState.summary.find((trip) => trip.trip_id === tripId);
      // Return early if no trip is found
      if (!foundTripData) return;
      // Set the selected trip state
      setSelectedTripState({ ...foundTripData, event_animation_index: foundTripData.positions.length });
      //
    },
    [requestState.summary]
  );

  const clearTripId = useCallback(() => {
    setSelectedTripState(initialSelectedTripState);
  }, []);

  const clearAllData = useCallback(async () => {
    setRequestState(initialRequestState);
    setSelectedTripState(initialSelectedTripState);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      // Return empty if filters are empty
      if (!formState.values.agency_code || !formState.values.start_date || !formState.values.end_date) return;
      // Update state to include request details
      setRequestState({ ...initialRequestState, is_loading: true, is_error: false, result: null });
      // Fetch the trips summary
      const result = await API({ service: 'reports/sales', operation: 'summary', method: 'POST', body: { agency_code: formState.values.agency_code, start_date: parseDate(formState.values.start_date), end_date: parseDate(formState.values.end_date) } });
      // Update state to indicate progress
      setRequestState((prev) => ({ ...prev, is_loading: false, result: result }));
      //
    } catch (error) {
      // Update state to indicate progress
      setRequestState((prev) => ({ ...prev, is_loading: false, is_error: error.message, result: null }));
    }
  }, [formState.values.agency_code, formState.values.end_date, formState.values.start_date]);

  //
  // E. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      form: formState,
      request: requestState,
      selectedTrip: selectedTripState,
      //
      clearAllData: clearAllData,
      //
      selectOperationDay: selectOperationDay,
      clearOperationDay: clearOperationDay,
      //
      selectAgencyId: selectAgencyId,
      clearAgencyId: clearAgencyId,
      //
      updateTableSearchQuery: updateTableSearchQuery,
      clearTableSearchQuery: clearTableSearchQuery,
      //
      updateTimeDistributionGraphTimeframe: updateTimeDistributionGraphTimeframe,
      updateTimeDistributionGraphType: updateTimeDistributionGraphType,
      updateEventOrderType: updateEventOrderType,
      updateEventAnimationIndex: updateEventAnimationIndex,
      //
      fetchEvents: fetchEvents,
      //
      selectTripId: selectTripId,
      clearTripId: clearTripId,
      //
    }),
    [
      formState,
      requestState,
      selectedTripState,
      clearAllData,
      selectOperationDay,
      clearOperationDay,
      selectAgencyId,
      clearAgencyId,
      updateTableSearchQuery,
      clearTableSearchQuery,
      updateTimeDistributionGraphTimeframe,
      updateTimeDistributionGraphType,
      updateEventOrderType,
      updateEventAnimationIndex,
      fetchEvents,
      selectTripId,
      clearTripId,
    ]
  );

  //
  // D. Return provider

  return <ReportsExplorerSalesContext.Provider value={contextObject}>{children}</ReportsExplorerSalesContext.Provider>;

  //
}
