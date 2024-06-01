import dayjs from 'dayjs';

import styles from './HCalendarPlaceholder.module.css';

export default function HCalendarPlaceholder({ date }) {
	const dayString = dayjs(date).format('D');
	return <div className={styles.container}>{dayString}</div>;
}
