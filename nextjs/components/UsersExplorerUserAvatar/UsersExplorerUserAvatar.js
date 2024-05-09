/* * */

import { Avatar } from '@mantine/core';
import styles from './UsersExplorerUserAvatar.module.css';

/* * */

export default function UsersExplorerUserAvatar({ userData }) {
	return (
		<Avatar radius="xl" size="sm">
			<p className={styles.userName}>{userData.name.substring(0, 2)}</p>
		</Avatar>
	);
}