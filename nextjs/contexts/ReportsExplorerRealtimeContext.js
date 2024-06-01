'use client';

/* * */

import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { JSONParser } from '@streamparser/json';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* * */

// 1.
// SETUP INITIAL STATE

const initialFormState = {
	//
	agency_code: null,
	event_order_type: 'insert_timestamp',
	operation_day: null,
	//
	table_search_query: '',
	//
	time_distribution_graph_timeframe: '30',
	time_distribution_graph_type: 'line',
	//
};

const initialRequestState = {
	//
	agency_code: null,
	is_error: false,
	//
	is_loading: false,
	operation_day: null,
	//
	summary: null,
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

const ReportsExplorerRealtimeContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useReportsExplorerRealtimeContext() {
	return useContext(ReportsExplorerRealtimeContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function ReportsExplorerRealtimeContextProvider({ children }) {
	//

	//
	// A. Setup state

	const [formState, setFormState] = useState(initialFormState);
	const [requestState, setRequestState] = useState(initialRequestState);
	const [selectedTripState, setSelectedTripState] = useState(initialSelectedTripState);

	//
	// C. Setup actions

	const selectOperationDay = useCallback((operationDay) => {
		setFormState(prev => ({ ...prev, operation_day: operationDay }));
		setRequestState(prev => ({ ...prev, is_error: false }));
	}, []);

	const clearOperationDay = useCallback(() => {
		setFormState(prev => ({ ...prev, operation_day: null }));
		setRequestState(prev => ({ ...prev, is_error: false }));
	}, []);

	const selectAgencyId = useCallback((agencyId) => {
		setFormState(prev => ({ ...prev, agency_code: agencyId }));
		setRequestState(prev => ({ ...prev, is_error: false }));
	}, []);

	const clearAgencyId = useCallback(() => {
		setFormState(prev => ({ ...prev, agency_code: null }));
		setRequestState(prev => ({ ...prev, is_error: false }));
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
		setRequestState(initialRequestState);
		setSelectedTripState(initialSelectedTripState);
	}, []);

	const fetchEvents = useCallback(async () => {
		try {
			// Return empty if filters are empty
			if (!formState.agency_code || !formState.operation_day) return;
			// Update state to include request details
			setRequestState({ ...initialRequestState, agency_code: formState.agency_code, is_error: false, is_loading: true, operation_day: formState.operation_day, summary: [] });
			// Fetch the trips summary
			const summaryResponse = await API({ body: { agency_code: formState.agency_code, operation_day: parseDate(formState.operation_day) }, method: 'POST', operation: 'summary', parseType: 'raw', service: 'reports/realtime' });
			// Setup the JSON parser to handle streaming response in the following pattern: [ {•••}, {•••}, {•••}, ... ]
			const jsonStreamParser = new JSONParser({ keepStack: false, paths: ['$.*'], stringBufferSize: undefined });
			// Set what happens when a new value is parsed
			jsonStreamParser.onValue = async ({ stack, value }) => {
				// Only procceed if value is a complete object
				if (stack > 0) return;
				// Update the state summary to save the streamed events
				setRequestState(prev => ({ ...prev, summary: [...prev.summary, value] }));
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
			setRequestState(prev => ({ ...prev, is_loading: false }));
			//
		}
		catch (error) {
			// Update state to indicate progress
			setRequestState(prev => ({ ...prev, is_error: error.message, is_loading: false, summary: null }));
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
			request: requestState,
			//
			selectAgencyId: selectAgencyId,
			//
			selectOperationDay: selectOperationDay,
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
		],
	);

	//
	// D. Return provider

	return <ReportsExplorerRealtimeContext.Provider value={contextObject}>{children}</ReportsExplorerRealtimeContext.Provider>;

	//
}
