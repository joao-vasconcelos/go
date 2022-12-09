import { Button, Alert, Flex, Text } from '@mantine/core';
import { TbRotate, TbAlertCircle } from 'react-icons/tb';
// import { styled } from '@stitches/react';

export default function ErrorDisplay({ error, loading, disabled, onTryAgain }) {
  if (error) {
    return (
      <Alert icon={<TbAlertCircle />} title={error.message} color='red'>
        <Flex gap='md' align='flex-start' direction='column'>
          {error.description && <Text>{error.description}</Text>}
          {onTryAgain && (
            <Button
              variant='default'
              color='red'
              leftIcon={<TbRotate />}
              disabled={disabled}
              loading={loading}
              onClick={onTryAgain}
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </Flex>
      </Alert>
    );
  }
}
