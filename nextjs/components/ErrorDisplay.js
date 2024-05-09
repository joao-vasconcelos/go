'use client';

import { Button, Alert, Text, SimpleGrid } from '@mantine/core';
import { IconRotate, IconAlertTriangleFilled } from '@tabler/icons-react';

export default function ErrorDisplay({ error, loading, disabled, onTryAgain }) {
	if (error) {
		return (
			<Alert icon={<IconAlertTriangleFilled size={'20px'} />} title={error.message} color="red">
				<SimpleGrid>
					{error.description && <Text>{error.description}</Text>}
					{onTryAgain &&
            <Button variant="default" color="red" leftSection={<IconRotate />} disabled={disabled} loading={loading} onClick={onTryAgain}>
            	{loading ? 'Retrying...' : 'Try Again'}
            </Button>
					}
				</SimpleGrid>
			</Alert>
		);
	}
}