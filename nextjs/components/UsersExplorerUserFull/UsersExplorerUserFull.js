/* * */

import UsersExplorerUserAvatar from '@/components/UsersExplorerUserAvatar/UsersExplorerUserAvatar';
import UsersExplorerUserSimple from '@/components/UsersExplorerUserSimple/UsersExplorerUserSimple';

import styles from './UsersExplorerUserFull.module.css';

/* * */

export default function UsersExplorerUserFull({ userData }) {
	return (
		<div className={styles.container}>
			<UsersExplorerUserAvatar userData={userData} />
			<UsersExplorerUserSimple size="md" userData={userData} />
		</div>
	);
}
