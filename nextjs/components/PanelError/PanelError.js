'use client';

/* * */

import styles from './PanelError.module.css';
import { useTranslations } from 'next-intl';
import { Button, Alert, Text, SimpleGrid } from '@mantine/core';
import { IconRotate, IconAlertTriangleFilled } from '@tabler/icons-react';

/* * */

export default function PanelError({ message, description, loading, disabled, onRetry }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('PanelError');

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<Alert icon={<IconAlertTriangleFilled size={20} />} title={message} color="red">
				<SimpleGrid>
					{description && <p className={styles.description}>{description}</p>}
					{onRetry &&
            <Button variant="default" color="red" leftSection={<IconRotate />} disabled={disabled} loading={loading} onClick={onRetry}>
            	{loading ? t('retrying') : t('retry')}
            </Button>
					}
				</SimpleGrid>
			</Alert>
		</div>
	);

	//
}