'use client';

import { Alert, Button, SimpleGrid, Text } from '@mantine/core';
import { IconAlertTriangleFilled, IconRotate } from '@tabler/icons-react';

export default function ErrorDisplay({ disabled, error, loading, onTryAgain }) {
	if (error) {
		return (
			<Alert color="red" icon={<IconAlertTriangleFilled size="20px" />} title={error.message}>
				<SimpleGrid>
					{error.description && <Text>{error.description}</Text>}
					{onTryAgain
					&& (
						<Button color="red" disabled={disabled} leftSection={<IconRotate />} loading={loading} onClick={onTryAgain} variant="default">
							{loading ? 'Retrying...' : 'Try Again'}
						</Button>
					)}
				</SimpleGrid>
			</Alert>
		);
	}
}
