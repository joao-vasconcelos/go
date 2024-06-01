/* * */

import styles from './UsersExplorerUserSimple.module.css';

/* * */

export default function UsersExplorerUserSimple({ size = 'sm', userData }) {
	return <div className={`${styles.container} ${styles[size]}`}>{userData.name}</div>;
}
