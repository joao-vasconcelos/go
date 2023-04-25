import { Button, Alert, Text } from '@mantine/core';
import { TbRotate, TbAlertTriangleFilled } from 'react-icons/tb';
// import { styled } from '@stitches/react';
import Flex from '../layouts/Flex';

export default function ErrorDisplay({ error, loading, disabled, onTryAgain }) {
  if (error) {
    return (
      <Alert icon={<TbAlertTriangleFilled size={'20px'} />} title={error.message} color='red'>
        <Flex align={'start'} direction='column'>
          {error.description && <Text>{error.description}</Text>}
          {onTryAgain && (
            <Button variant='default' color='red' leftIcon={<TbRotate />} disabled={disabled} loading={loading} onClick={onTryAgain}>
              {loading ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </Flex>
      </Alert>
    );
  }
}
