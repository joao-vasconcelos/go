export default function calculateTravelTime(distanceInMeters, speedInKmPerHour) {
	//

	if (distanceInMeters === 0 || speedInKmPerHour === 0) {
		return 0;
	}
	const speedInMetersPerSecond = (speedInKmPerHour * 1000) / 3600;
	const travelTimeInSeconds = parseInt(distanceInMeters / speedInMetersPerSecond);
	return travelTimeInSeconds || 0;

	//
}
