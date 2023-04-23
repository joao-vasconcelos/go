'use client';

import { styled } from '@stitches/react';
import { TbChevronRight } from 'react-icons/tb';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$md',
  width: '100%',
  backgroundColor: '#ffffff',
  padding: '$md',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray2',
  },
  '&:active': {
    backgroundColor: '$gray3',
  },
});

export default function ListItem({ service_id, service_name }) {
  //

  return (
    <Container>
      <p>{service_id}</p>
      <p>{service_name}</p>
      <TbChevronRight size={'20px'} opacity={0.25} />
    </Container>
  );
}
