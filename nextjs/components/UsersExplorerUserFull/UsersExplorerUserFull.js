/* * */

import styles from './UsersExplorerUserFull.module.css';
import UsersExplorerUserAvatar from '@/components/UsersExplorerUserAvatar/UsersExplorerUserAvatar';
import UsersExplorerUserSimple from '@/components/UsersExplorerUserSimple/UsersExplorerUserSimple';

/* * */

export default function UsersExplorerUserFull({ userData }) {
	return (
		<div className={styles.container}>
			<UsersExplorerUserAvatar userData={userData} />
			<UsersExplorerUserSimple userData={userData} size="md" />
		</div>
	);
}