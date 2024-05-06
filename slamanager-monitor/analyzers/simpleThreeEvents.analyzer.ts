/* * */

export default async ({ unique_trip, events = [] }) => {
	//

	try {
		//

		const sortedTripPath = unique_trip.path.sort((a, b) => {
			return a.stop_sequence - b.stop_sequence;
		});

		const stopIdsToCheck = new Set;

		// Get first three stops of trip
		sortedTripPath.slice(0, 2).forEach((item) => stopIdsToCheck.add(item.stop_id));
		// Get last three stops of trip
		sortedTripPath.slice(-2).forEach((item) => stopIdsToCheck.add(item.stop_id));
		// Get middle three stops of trip
		sortedTripPath.slice(sortedTripPath.length / 2 - 1, 3).forEach((item) => stopIdsToCheck.add(item.stop_id));

		const foundStopIds = new Set;

		for (const event of events) {
			if (stopIdsToCheck.has(event.content.entity[0].vehicle.stopId)) {
				foundStopIds.add(event.content.entity[0].vehicle.stopId);
			}
		}

		if (foundStopIds.size < stopIdsToCheck.size) {
			const missingStopsCount = stopIdsToCheck.size - foundStopIds.size;
			const missingStopIds = Array.from(new Set([...stopIdsToCheck].filter((stopId) => !foundStopIds.has(stopId)))).join('|');
			return {
				code: 'SIMPLE_THREE_EVENTS/1.0.0',
				status: 'COMPLETE',
				grade: 'FAIL',
				reason: 'NOT_ENOUGH_STOPS',
				message: `Found ${foundStopIds.size} of ${stopIdsToCheck.size} expected stops. Missing ${missingStopsCount} stops: [${missingStopIds}]`,
			};
		}

		if (foundStopIds.size === stopIdsToCheck.size) {
			const missingStopsCount = stopIdsToCheck.size - foundStopIds.size;
			return {
				code: 'SIMPLE_THREE_EVENTS/1.0.0',
				status: 'COMPLETE',
				grade: 'PASS',
				reason: 'ALL_STOPS_MATCHED',
				message: `All ${foundStopIds.size} of ${stopIdsToCheck.size} expected stops found Missing ${missingStopsCount} stops.`,
			};
		}

		//
	} catch (error) {
		console.log(error);
		return {
			code: 'SIMPLE_THREE_EVENTS/1.0.0',
			status: 'ERROR',
			grade: null,
			reason: null,
			message: error.message,
		};
	}

	//
};