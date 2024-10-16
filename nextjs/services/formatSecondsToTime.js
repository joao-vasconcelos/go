/* * */

export default function formatSecondsToTime(timeInSeconds) {
	//
	if (!timeInSeconds && timeInSeconds !== 0) return '•••';

	if (timeInSeconds < 60) {
		return timeInSeconds + ' seg';
	}
	else if (timeInSeconds < 3600) {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = timeInSeconds % 60;
		return `${minutes} min ${seconds} seg`;
	}
	else {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = timeInSeconds % 60;
		return `${hours} h ${minutes} min ${seconds} seg`;
	}

	//
}
