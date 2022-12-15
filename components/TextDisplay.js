import { Button, Alert, Flex, Text, Tooltip } from '@mantine/core';
import { TbRotate, TbAlertCircle } from 'react-icons/tb';
import { styled } from '@stitches/react';
import { forwardRef } from 'react';

export const Container = styled('div', {
  // borderLeft: '2px solid $gray5',
  display: 'flex',
  flexDirection: 'column',
  // padding: '$sm',
  gap: '10px',
});

export const Label = styled('p', {
  fontWeight: '$bold',
  color: '$gray11',
  fontSize: '13px',
  textTransform: 'uppercase',
  lineHeight: 1,
});

export const Description = styled('p', {
  fontWeight: '$regular',
  color: '$gray11',
  fontSize: '12px',
  lineHeight: 1,
});

export const Value = styled('p', {
  fontWeight: '$bold',
  color: '$gray12',
  fontSize: '16px',
  lineHeight: 1,
  // marginTop: '5px',
});

export default function TextDisplay({ label, description, value }) {
  const MyComponent = forwardRef((props, ref) => (
    <Container ref={ref} {...props}>
      <Label size='sm' weight={500}>
        {label}
      </Label>
      <Value>{value || ''}</Value>
    </Container>
  ));
  MyComponent.displayName = 'TextDisplay';

  return (
    <Tooltip label={description} withArrow transition={'fade'} transitionDuration={200}>
      <MyComponent />
    </Tooltip>
  );
}
