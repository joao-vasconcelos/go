/* * */

import Loader from '@/components/Loader/Loader';
import PanelError from '@/components/PanelError/PanelError';

import styles from './Pannel.module.css';

/* * */

export default function Pannel({ children, error, footer, header, loading, onRetry, validating }) {
	//

	return (
		<div className={styles.container}>
			{loading && <Loader full visible />}
			{header && <div className={styles.header}>{header}</div>}
			{error && <PanelError description={error.description} loading={validating} message={error.message} onRetry={onRetry} />}
			<div className={styles.body}>{children}</div>
			{footer && <div className={styles.footer}>{footer}</div>}
		</div>
	);

	//
}
