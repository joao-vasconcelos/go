'use client';

/* * */

import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { JSONParser } from '@streamparser/json';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

// 1.
// SETUP INITIAL STATE

const initialFormState = {
	is_error: false,
	//
	is_loading: false,
	//
	list_data: [],
	table_current_page: 1,
	//
	table_search_query: '',
	//
};

const initialListState = {
	//
	//
};

const initialSelectedTripState = {
	//
	agency_code: null,
	//
	event_animation_index: null,
	//
	found_vehicles: null,
	//
	line_id: null,
	pattern_id: null,
	route_id: null,
	//
	schedule_relationship: null,
	//
	trip_id: null,
	//
};

/* * */

// 2.
// CREATE CONTEXTS

const ReportsExplorerSlaContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useReportsExplorerSlaContext() {
	return useContext(ReportsExplorerSlaContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function ReportsExplorerSlaContextProvider({ children }) {
	//

	//
	// A. Setup state

	const [formState, setFormState] = useState(initialFormState);
	const [requestState, setListState] = useState(initialListState);
	const [selectedTripState, setSelectedTripState] = useState(initialSelectedTripState);

	//
	// B. Fetch data

	const { data: allTripAnalysisData, isLoading: allTripAnalysisLoading } = useSWR('/api/reports/sla/summary');

	//
	// C. Setup actions

	useEffect(() => {
		setFormState(prev => ({ ...prev, is_loading: allTripAnalysisLoading }));
	}, [allTripAnalysisLoading]);

	useEffect(() => {
		if (!allTripAnalysisData) return;
		const parsedTripAnalysisData = allTripAnalysisData;
		setFormState(prev => ({ ...prev, list_data: parsedTripAnalysisData }));
	}, [allTripAnalysisData]);

	//
	// C. Setup actions

	const handleTablePageChange = useCallback((page) => {
		setFormState(prev => ({ ...prev, table_current_page: page }));
	}, []);

	const clearOperationDay = useCallback(() => {
		setListState(prev => ({ ...prev, is_error: false }));
	}, []);

	const selectAgencyId = useCallback((agencyId) => {
		setFormState(prev => ({ ...prev, agency_code: agencyId }));
		setListState(prev => ({ ...prev, is_error: false }));
	}, []);

	const clearAgencyId = useCallback(() => {
		setFormState(prev => ({ ...prev, agency_code: null }));
		setListState(prev => ({ ...prev, is_error: false }));
	}, []);

	const updateTableSearchQuery = useCallback((value) => {
		setFormState(prev => ({ ...prev, table_search_query: value }));
	}, []);

	const clearTableSearchQuery = useCallback(() => {
		setFormState(prev => ({ ...prev, table_search_query: '' }));
	}, []);

	const updateTimeDistributionGraphTimeframe = useCallback((value) => {
		setFormState(prev => ({ ...prev, time_distribution_graph_timeframe: value }));
	}, []);

	const updateTimeDistributionGraphType = useCallback((value) => {
		setFormState(prev => ({ ...prev, time_distribution_graph_type: value }));
	}, []);

	const updateEventOrderType = useCallback((value) => {
		setFormState(prev => ({ ...prev, event_order_type: value }));
	}, []);

	const updateEventAnimationIndex = useCallback((value) => {
		setSelectedTripState(prev => ({ ...prev, event_animation_index: value }));
	}, []);

	const selectTripId = useCallback(
		(tripId) => {
			// Check if there are parsed unique trips
			if (!requestState.summary) return;
			// Retrieve the desired trip from the list of unique trips
			const foundTripData = requestState.summary.find(trip => trip.trip_id === tripId);
			// Return early if no trip is found
			if (!foundTripData) return;
			// Set the selected trip state
			setSelectedTripState({ ...foundTripData, event_animation_index: foundTripData.positions.length });
			//
		},
		[requestState.summary],
	);

	const clearTripId = useCallback(() => {
		setSelectedTripState(initialSelectedTripState);
	}, []);

	const clearAllData = useCallback(async () => {
		setListState(initialListState);
		setSelectedTripState(initialSelectedTripState);
	}, []);

	const fetchEvents = useCallback(async () => {
		try {
			// Return empty if filters are empty
			if (!formState.agency_code || !formState.operation_day) return;
			// Update state to include request details
			setListState({ ...initialListState, agency_code: formState.agency_code, is_error: false, is_loading: true, operation_day: formState.operation_day, summary: [] });
			// Fetch the trips summary
			const summaryResponse = await API({ body: { agency_code: formState.agency_code, operation_day: parseDate(formState.operation_day) }, method: 'POST', operation: 'summary', parseType: 'raw', service: 'reports/realtime' });
			// Setup the JSON parser to handle streaming response in the following pattern: [ {•••}, {•••}, {•••}, ... ]
			const jsonStreamParser = new JSONParser({ keepStack: false, paths: ['$.*'], stringBufferSize: undefined });
			// Set what happens when a new value is parsed
			jsonStreamParser.onValue = async ({ stack, value }) => {
				// Only procceed if value is a complete object
				if (stack > 0) return;
				// Update the state summary to save the streamed events
				setListState(prev => ({ ...prev, summary: [...prev.summary, value] }));
			};
			// Get response Reader object
			const reader = summaryResponse.body.getReader(TextDecoderStream);
			// Parse reader values while data is available
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				jsonStreamParser.write(value);
			}
			// Update state to indicate progress
			setListState(prev => ({ ...prev, is_loading: false }));
			//
		}
		catch (error) {
			// Update state to indicate progress
			setListState(prev => ({ ...prev, is_error: error.message, is_loading: false, summary: null }));
		}
	}, [formState.agency_code, formState.operation_day]);

	//
	// E. Setup context object

	const contextObject = useMemo(
		() => ({
			clearAgencyId: clearAgencyId,
			//
			clearAllData: clearAllData,
			clearOperationDay: clearOperationDay,
			clearTableSearchQuery: clearTableSearchQuery,
			clearTripId: clearTripId,
			//
			fetchEvents: fetchEvents,
			//
			form: formState,
			//
			handleTablePageChange: handleTablePageChange,
			request: requestState,
			//
			selectAgencyId: selectAgencyId,
			//
			selectTripId: selectTripId,
			selectedTrip: selectedTripState,
			updateEventAnimationIndex: updateEventAnimationIndex,
			updateEventOrderType: updateEventOrderType,
			//
			updateTableSearchQuery: updateTableSearchQuery,
			//
			updateTimeDistributionGraphTimeframe: updateTimeDistributionGraphTimeframe,
			updateTimeDistributionGraphType: updateTimeDistributionGraphType,
			//
		}),
		[
			formState,
			requestState,
			selectedTripState,
			clearAllData,
			handleTablePageChange,
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
		],
	);

	//
	// D. Return provider

	return <ReportsExplorerSlaContext.Provider value={contextObject}>{children}</ReportsExplorerSlaContext.Provider>;

	//
}
