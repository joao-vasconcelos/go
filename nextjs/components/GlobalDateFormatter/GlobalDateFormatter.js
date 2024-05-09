/* * */

import { Box, Tooltip } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useFormatter, useNow } from 'next-intl';
import styles from './GlobalDateFormatter.module.css';

/* * */

export default function GlobalDateFormatter({ value, icon }) {
	//

	//
	// A. Setup variables

	const format = useFormatter();

	const now = useNow({ updateInterval: 1000 });

	const dateValue = new Date(value);

	//
	// B. Render components

	return (
		<Tooltip label={format.dateTime(dateValue, { dateStyle: 'full', timeStyle: 'short' })} withArrow>
			<Box className={styles.container}>
				{icon || <IconClock size={14} />}
				<p className={styles.time}>{format.relativeTime(dateValue, now)}</p>
			</Box>
		</Tooltip>
	);

	//
}