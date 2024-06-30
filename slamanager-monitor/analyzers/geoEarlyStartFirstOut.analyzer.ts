/* * */

import { AnalysisData } from '@/types/analysisData.type.js';
import { AnalysisResult, AnalysisResultGrade, AnalysisResultStatus } from '@/types/analysisResult.type.js';
import * as turf from '@turf/turf';
import { DateTime } from 'luxon';

/* * */

// This analyzer tests if the trip started earlier than scheduled using geographic data.
// It uses the timestamp of the first event that is outside the geofence
// of the first stop of the trip to determine the trip start time.
//
// GRADES:
// → PASS = Trip started started at scheduled time or later.
// → FAIL = Trip started earlier than scheduled.

/* * */

interface ExtendedAnalysisResult extends AnalysisResult {
	code: 'GEO_EARLY_START_FIRST_OUT'
	reason: 'TRIP_STARTED_AT_OR_LATER_THAN_SCHEDULED' | 'TRIP_STARTED_EARLIER_THAN_SCHEDULED'
	unit: 'MINUTES_EARLY' | null
	value: null | number
};

/* * */

export default (analysisData: AnalysisData): ExtendedAnalysisResult => {
	//

	try {
		//

		// 1.
		// Sort the path by stop_sequence

		const sortedTripPath = analysisData.hashed_trip.path.sort((a, b) => {
			return a.stop_sequence - b.stop_sequence;
		});

		// 2.
		// Prepare the operational day date for the given trip

		let operationalDayDateTimeObject = DateTime.fromFormat(analysisData.trip_analysis.operational_day, 'yyyyMMdd').startOf('day');

		// 3.
		// Extract the expected arrival time of the first stop of the trip

		const firstStopExpectedArrivalTime = sortedTripPath[0]?.arrival_time;

		const expectedArrivalTimeHours = firstStopExpectedArrivalTime.split(':')[0];
		const expectedArrivalTimeMinutes = firstStopExpectedArrivalTime.split(':')[1];
		const expectedArrivalTimeSeconds = firstStopExpectedArrivalTime.split(':')[2];

		if (expectedArrivalTimeHours > 23 && expectedArrivalTimeMinutes > 59 && expectedArrivalTimeSeconds > 59) {
			operationalDayDateTimeObject = operationalDayDateTimeObject.plus({ days: 1 });
		}

		const expectedArrivalTimeDateTimeObject = operationalDayDateTimeObject.set({ hour: expectedArrivalTimeHours, minute: expectedArrivalTimeMinutes, second: expectedArrivalTimeSeconds });

		// 3.
		// Build a geofence of 30 meters around the first stop of the trip

		const firstStopTurfPoint = turf.point([Number(sortedTripPath[0].stop_lon), Number(sortedTripPath[0].stop_lat)]);
		const firstStopTurfBuffer = turf.buffer(firstStopTurfPoint, 30, { units: 'meters' });

		// 4.
		// Sort vehicle events by vehicle timestamp

		const sortedVehicleEvents = analysisData.vehicle_events?.sort((a, b) => {
			return a.content.entity[0].vehicle.timestamp - b.content.entity[0].vehicle.timestamp;
		});

		// 5.
		// For each point, check if they are inside the geofence or not
		// Record the last event that is inside the geofence

		let lastEventInsideGeofenceIndex = -1;

		for (const [vehicleEventIndex, vehicleEventData] of sortedVehicleEvents.entries()) {
			//
			const vehicleEventTurfPoint = turf.point([vehicleEventData.content.entity[0].vehicle.position.longitude, vehicleEventData.content.entity[0].vehicle.position.latitude]);
			//
			const vehicleEventIsInsideGefense = turf.booleanPointInPolygon(vehicleEventTurfPoint, firstStopTurfBuffer);
			//
			if (!vehicleEventIsInsideGefense) {
				lastEventInsideGeofenceIndex = vehicleEventIndex;
				break;
			}
		}

		const firstEventOutsideGeofence = sortedVehicleEvents[lastEventInsideGeofenceIndex + 1];

		// 6.
		// Check the timestamp of the event against the expected arrival time of the first stop

		const firstEventOutsideGeofenceTimestamp = firstEventOutsideGeofence?.content.entity[0].vehicle.timestamp;
		const firstEventOutsideGeofenceDateTimeObject = DateTime.fromSeconds(firstEventOutsideGeofenceTimestamp);

		const delayInMinutes = firstEventOutsideGeofenceDateTimeObject.diff(expectedArrivalTimeDateTimeObject, 'minutes').minutes;

		// 7.
		// Return the result

		if (delayInMinutes < 0) {
			return {
				code: 'GEO_EARLY_START_FIRST_OUT',
				grade: AnalysisResultGrade.FAIL,
				message: `Trip started ${delayInMinutes} minutes earlier than scheduled.`,
				reason: 'TRIP_STARTED_EARLIER_THAN_SCHEDULED',
				status: AnalysisResultStatus.COMPLETE,
				unit: 'MINUTES_EARLY',
				value: delayInMinutes,
			};
		}

		return {
			code: 'GEO_EARLY_START_FIRST_OUT',
			grade: AnalysisResultGrade.PASS,
			message: `Trip started ${delayInMinutes} minutes after scheduled time.`,
			reason: 'TRIP_STARTED_AT_OR_LATER_THAN_SCHEDULED',
			status: AnalysisResultStatus.COMPLETE,
			unit: 'MINUTES_EARLY',
			value: delayInMinutes,
		};

		//
	}
	catch (error) {
		console.log(error);
		return {
			code: 'GEO_EARLY_START_FIRST_OUT',
			grade: null,
			message: error.message,
			reason: null,
			status: AnalysisResultStatus.ERROR,
			unit: null,
			value: null,
		};
	}

	//
};
