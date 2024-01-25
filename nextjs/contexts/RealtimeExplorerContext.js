'use client';

/* * */

import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* * */

// 1.
// SETUP INITIAL STATE

const initialFormState = {
  //
  agency_code: '41', // Should be agency_code
  operation_day: new Date(2024, 0, 2),
  //
};

const initialRequestState = {
  //
  is_loading: false,
  is_processing: false,
  //
  agency_code: null,
  operation_day: null,
  //
  raw_events: null,
  unique_trips: null,
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
  raw_events: null,
  //
};

/* * */

// 2.
// CREATE CONTEXTS

const RealtimeExplorerContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useRealtimeExplorerContext() {
  return useContext(RealtimeExplorerContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function RealtimeExplorerContextProvider({ children }) {
  //

  //
  // A. Setup state

  const [formState, setFormState] = useState(initialFormState);
  const [requestState, setRequestState] = useState(initialRequestState);
  const [selectedTripState, setSelectedTripState] = useState(initialSelectedTripState);

  //
  // C. Setup actions

  const extractUniqueTripsFromEvents = (rawEvents) => {
    //
    if (!rawEvents) return;

    // Iterate on each event

    const groupedByTripId = {};

    rawEvents.forEach((event) => {
      //
      const tripId = event.content?.entity[0]?.vehicle?.trip?.tripId;
      const lineId = event.content?.entity[0]?.vehicle?.trip?.lineId;
      const routeId = event.content?.entity[0]?.vehicle?.trip?.routeId;
      const patternId = event.content?.entity[0]?.vehicle?.trip?.patternId;
      const scheduleRelationship = event.content?.entity[0]?.vehicle?.trip?.scheduleRelationship;
      const vehicleTimestamp = event.content?.entity[0]?.vehicle?.timestamp;
      //
      if (!tripId) return;
      //
      if (!groupedByTripId[tripId]) {
        groupedByTripId[tripId] = {
          trip_id: tripId,
          line_id: lineId,
          route_id: routeId,
          pattern_id: patternId,
          schedule_relationship: scheduleRelationship,
          raw_events: [],
        };
      }
      //
      groupedByTripId[tripId].raw_events.push(event);
      //
    });

    const arrayOfUniqueTrips = Object.values(groupedByTripId);

    const arrayOfUniqueTripsSorted = arrayOfUniqueTrips.map((trip) => ({ ...trip, raw_events: trip.raw_events.sort((a, b) => a.content?.entity[0]?.vehicle?.timestamp - b.content?.entity[0]?.vehicle?.timestamp) }));

    return arrayOfUniqueTripsSorted;

    //
  };

  //
  // C. Setup actions

  const selectOperationDay = useCallback((operationDay) => {
    setFormState((prev) => ({ ...prev, operation_day: operationDay }));
  }, []);

  const clearOperationDay = useCallback(() => {
    setFormState((prev) => ({ ...prev, operation_day: null }));
  }, []);

  const selectAgencyId = useCallback((agencyId) => {
    setFormState((prev) => ({ ...prev, agency_code: agencyId }));
  }, []);

  const clearAgencyId = useCallback(() => {
    setFormState((prev) => ({ ...prev, agency_code: null }));
  }, []);

  const selectTripId = useCallback(
    (tripId) => {
      // Check if there are parsed unique trips
      if (!requestState.unique_trips) return;
      // Retrieve the desired trip from the list of unique trips
      const foundTripData = requestState.unique_trips.find((trip) => trip.trip_id === tripId);
      // Return early if no trip is found
      if (!foundTripData) return;
      // Set the selected trip state
      setSelectedTripState({ ...foundTripData });
      //
    },
    [requestState.unique_trips]
  );

  const clearTripId = useCallback(() => {
    setSelectedTripState(initialSelectedTripState);
  }, []);

  const clearAllData = useCallback(() => {
    setFormState(initialFormState);
  }, []);

  const fetchEvents = useCallback(async () => {
    // Return empty if filters are empty
    if (!formState.agency_code || !formState.operation_day) return;
    // Set the flag to indicate progress
    setRequestState({ ...initialRequestState, is_loading: true, agency_code: formState.agency_code, operation_day: formState.operation_day });
    // Fetch all events matching filters
    const allEventsData = await API({
      service: 'realtime',
      operation: 'list',
      method: 'POST',
      body: {
        agency_code: formState.agency_code,
        operation_day: parseDate(formState.operation_day),
      },
    });
    // Save events to state and update the flag
    setRequestState((prev) => ({ ...prev, is_loading: false, is_processing: true, raw_events: allEventsData }));
    //
    const uniqueTrips = extractUniqueTripsFromEvents(allEventsData);
    setRequestState((prev) => ({ ...prev, is_processing: false, unique_trips: uniqueTrips }));
    //
  }, [formState.agency_code, formState.operation_day]);

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
      fetchEvents: fetchEvents,
      //
      selectTripId: selectTripId,
      clearTripId: clearTripId,
      //
    }),
    [formState, requestState, selectedTripState, clearAllData, selectOperationDay, clearOperationDay, selectAgencyId, clearAgencyId, fetchEvents, selectTripId, clearTripId]
  );

  //
  // D. Return provider

  return <RealtimeExplorerContext.Provider value={contextObject}>{children}</RealtimeExplorerContext.Provider>;

  //
}
