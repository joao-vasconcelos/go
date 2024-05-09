/* * */

import styles from './UsersExplorerUserSimple.module.css';

/* * */

export default function UsersExplorerUserSimple({ userData, size = 'sm' }) {
	return <div className={`${styles.container} ${styles[size]}`}>{userData.name}</div>;
}