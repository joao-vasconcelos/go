import { styled } from '@stitches/react';
import { CopyButton, Loader } from '@mantine/core';

/* * */
/* GROUP */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Title = styled('div', {
  color: '$gray12',
  fontSize: '13px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
});

const Value = styled('div', {
  color: '$gray12',
  fontSize: 30,
  fontWeight: '$bold',
});

const Container = styled('div', {
  backgroundColor: '$gray0',
  borderRadius: '$sm',
  borderWidth: '$sm',
  borderStyle: 'solid',
  borderColor: '$gray8',
  padding: '$md',
  display: 'flex',
  flexDirection: 'column',
  gap: '$sm',
  boxShadow: '$sm',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray1',
    boxShadow: '$md',
    [`& ${Title}`]: {
      color: '$primary5',
    },
    [`& ${Value}`]: {
      color: '$primary5',
    },
  },
  '&:active': {
    backgroundColor: '$gray3',
    borderColor: '$primary5',
  },
});

/* */
/* LOGIC */

export default function StatCard({ title, value }) {
  //

  let isLoading = true;

  if (value || value === 0) isLoading = false;

  return (
    <CopyButton value={value}>
      {({ copied, copy }) =>
        isLoading ? (
          <Container>
            <Title>{title}</Title>
            <Loader color='gray' size='sm' />
          </Container>
        ) : (
          <Container onClick={copy}>
            <Title>{copied ? 'Value copied' : title}</Title>
            <Value>{value}</Value>
          </Container>
        )
      }
    </CopyButton>
  );
}
