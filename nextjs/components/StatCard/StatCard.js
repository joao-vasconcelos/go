/* * */

import styles from './StatCard.module.css';
import Loader from '../Loader/Loader';
import Text from '../Text/Text';
import { CopyButton } from '@mantine/core';
import { Link } from '@/translations/navigation';
import { IconChevronRight } from '@tabler/icons-react';

/* * */

export default function StatCard({ title, label, value, link, displayValue, type = 'copy', isLoading = false }) {
	//

	if (isLoading || (!value && value != 0)) {
		return (
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<Text size="h4">{title || label}</Text>
					<Loader size={25} visible />
				</div>
			</div>
		);
	}

	if (type === 'copy') {
		return (
			<CopyButton value={value}>
				{({ copied, copy }) => <div className={styles.container} onClick={copy}>
					<div className={styles.wrapper}>
						<Text size="h4">{copied ? 'Value Copied' : title || label}</Text>
						<div className={styles.value}>{displayValue || value}</div>
					</div>
				</div>
				}
			</CopyButton>
		);
	}

	if (type === 'link') {
		return (
			<Link href={link} target="_blank">
				<div className={styles.container}>
					<div className={styles.wrapper}>
						<Text size="h4">{title || label}</Text>
						<div className={styles.value}>{value}</div>
					</div>
					<IconChevronRight className={styles.chevron} />
				</div>
			</Link>
		);
	}

	//
}