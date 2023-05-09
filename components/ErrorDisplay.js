'use client';

import { Button, Alert, Text, SimpleGrid } from '@mantine/core';
import { TbRotate, TbAlertTriangleFilled } from 'react-icons/tb';

export default function ErrorDisplay({ error, loading, disabled, onTryAgain }) {
  if (error) {
    return (
      <Alert icon={<TbAlertTriangleFilled size={'20px'} />} title={error.message} color='red'>
        <SimpleGrid>
          {error.description && <Text>{error.description}</Text>}
          {onTryAgain && (
            <Button variant='default' color='red' leftIcon={<TbRotate />} disabled={disabled} loading={loading} onClick={onTryAgain}>
              {loading ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </SimpleGrid>
      </Alert>
    );
  }
}
