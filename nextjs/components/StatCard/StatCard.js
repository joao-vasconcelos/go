/* * */

import { Link } from '@/translations/navigation';
import { CopyButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import Loader from '../Loader/Loader';
import Text from '../Text/Text';
import styles from './StatCard.module.css';

/* * */

export default function StatCard({ displayValue, isLoading = false, label, link, title, type = 'copy', value }) {
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
				{({ copied, copy }) => (
					<div className={styles.container} onClick={copy}>
						<div className={styles.wrapper}>
							<Text size="h4">{copied ? 'Value Copied' : title || label}</Text>
							<div className={styles.value}>{displayValue || value}</div>
						</div>
					</div>
				)}
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
