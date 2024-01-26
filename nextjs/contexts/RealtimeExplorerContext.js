'use client';

/* * */

import API from '@/services/API';
import INDEXEDDB from '@/services/INDEXEDDB';
import parseDate from '@/services/parseDate';
import { JSONParser } from '@streamparser/json';
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
  //
  agency_code: null,
  operation_day: null,
  //
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

    const groupedByTripId = {};

    // await INDEXEDDB.iterateOnIndexFrom(INDEXEDDB.objectStores.vehicleEvents, 'trip_id', (indexKey, primaryKey, value) => {
    //   if (!groupedByTripId[value.trip_id]) {
    //     console.log('new trip found:', value.trip_id);
    //     groupedByTripId[value.trip_id] = {
    //       trip_id: value.trip_id,
    //       line_id: value.line_id,
    //       route_id: value.route_id,
    //       pattern_id: value.pattern_id,
    //       event_ids: [],
    //       raw_events: [],
    //     };
    //   }
    //   //
    //   groupedByTripId[value.trip_id].event_ids.push(value._id);
    // });

    // const arrayOfUniqueTrips = Object.values(groupedByTripId);

    // // const arrayOfUniqueTripsSorted = arrayOfUniqueTrips.map((trip) => ({ ...trip, raw_events: trip.raw_events.sort((a, b) => a.content?.entity[0]?.vehicle?.timestamp - b.content?.entity[0]?.vehicle?.timestamp) }));

    // return arrayOfUniqueTrips;

    // await INDEXEDDB.iterateOnIndexFrom(INDEXEDDB.objectStores.vehicleEvents, 'trip_id', (indexKey, primaryKey, value) => {});

    if (!rawEvents) return;

    // // Iterate on each event

    rawEvents.forEach((event) => {
      //
      //   const tripId = event.content?.entity[0]?.vehicle?.trip?.tripId;
      //   const lineId = event.content?.entity[0]?.vehicle?.trip?.lineId;
      //   const routeId = event.content?.entity[0]?.vehicle?.trip?.routeId;
      //   const patternId = event.content?.entity[0]?.vehicle?.trip?.patternId;
      //   const scheduleRelationship = event.content?.entity[0]?.vehicle?.trip?.scheduleRelationship;
      //   const vehicleTimestamp = event.content?.entity[0]?.vehicle?.timestamp;
      //
      if (!event.trip_id) return;
      //
      if (!groupedByTripId[event.trip_id]) {
        groupedByTripId[event.trip_id] = {
          trip_id: event.trip_id,
          line_id: event.line_id,
          route_id: event.route_id,
          pattern_id: event.pattern_id,
          //   schedule_relationship: event.schedule_relationship,
          raw_events: [],
        };
      }
      //
      groupedByTripId[event.trip_id].raw_events.push(event);
      //
    });

    const arrayOfUniqueTrips = Object.values(groupedByTripId);

    // const arrayOfUniqueTripsSorted = arrayOfUniqueTrips.map((trip) => ({ ...trip, raw_events: trip.raw_events.sort((a, b) => a.content?.entity[0]?.vehicle?.timestamp - b.content?.entity[0]?.vehicle?.timestamp) }));

    return arrayOfUniqueTrips;

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

  const clearAllData = useCallback(async () => {
    setRequestState(initialRequestState);
    setSelectedTripState(initialSelectedTripState);
    await INDEXEDDB.clearAllRowsFrom(INDEXEDDB.objectStores.vehicleEvents);
  }, []);

  const fetchEvents = useCallback(async () => {
    // return;
    // Return empty if filters are empty
    if (!formState.agency_code || !formState.operation_day) return;
    // Set the flag to indicate progress
    setRequestState({ ...initialRequestState, is_loading: true, agency_code: formState.agency_code, operation_day: formState.operation_day, unique_trips: [] });
    //

    const response = await fetch('/api/realtime/list', {
      method: 'POST',
      body: JSON.stringify({
        agency_code: formState.agency_code,
        operation_day: parseDate(formState.operation_day),
      }),
    });

    const jsonparser = new JSONParser({ stringBufferSize: undefined, paths: ['$.*'], keepStack: false });
    jsonparser.onValue = async ({ value, key, parent, stack }) => {
      if (stack > 0) return; // I don't know what this is for, but it works
      // Skip if deadrun
      //   if (value.content.entity[0].vehicle.deadRunId) return;
      // Get essential info from event
      try {
        console.log(value);
        setRequestState((prev) => ({ ...prev, unique_trips: [...prev.unique_trips, value] }));
        // const parsedEvent = {
        //   _id: value._id,
        //   millis: value.millis,
        //   line_id: value.content.entity[0].vehicle.trip.lineId,
        //   route_id: value.content.entity[0].vehicle.trip.routeId,
        //   pattern_id: value.content.entity[0].vehicle.trip.patternId,
        //   trip_id: value.content.entity[0].vehicle.trip.tripId,
        //   stop_id: value.content.entity[0].vehicle.stopId,
        //   vehicle_id: value.content.entity[0].vehicle.vehicle._id,
        //   driver_id: value.content.entity[0].vehicle.vehicle.driverId,
        //   operator_event_id: value.content.entity[0]._id,
        //   operation_plan_id: value.content.entity[0].vehicle.operationPlanId,
        //   raw: value,
        // };
        // await INDEXEDDB.addRowTo(INDEXEDDB.objectStores.vehicleEvents, value);
      } catch (error) {
        console.log('------');
        console.log(error);
        console.log('--- the above error was caused by the following object: ---');
        console.log(value);
        console.log('------');
      }
    };

    const reader = response.body.getReader(TextDecoderStream);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      jsonparser.write(value);
    }

    // setRequestState((prev) => ({ ...prev, is_loading: false, }));

    // const allRawData = await INDEXEDDB.getAllRowsFrom(INDEXEDDB.objectStores.vehicleEvents);

    // const allUniqueTrips = await extractUniqueTripsFromEvents();

    // console.log(allUniqueTrips);

    setRequestState((prev) => ({ ...prev, is_loading: false }));

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
