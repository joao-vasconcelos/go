'use client';

/* * */

import { Alert, Button, SimpleGrid, Text } from '@mantine/core';
import { IconAlertTriangleFilled, IconRotate } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './PanelError.module.css';

/* * */

export default function PanelError({ description, disabled, loading, message, onRetry }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PanelError');

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<Alert color="red" icon={<IconAlertTriangleFilled size={20} />} title={message}>
				<SimpleGrid>
					{description && <p className={styles.description}>{description}</p>}
					{onRetry
					&& (
						<Button color="red" disabled={disabled} leftSection={<IconRotate />} loading={loading} onClick={onRetry} variant="default">
							{loading ? t('retrying') : t('retry')}
						</Button>
					)}
				</SimpleGrid>
			</Alert>
		</div>
	);

	//
}
