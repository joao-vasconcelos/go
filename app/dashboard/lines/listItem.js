'use client';

import { styled } from '@stitches/react';
import Line from '../../../components/line/Line';
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

export default function ListItem({ short_name, long_name }) {
  //

  return (
    <Container>
      <Line short_name={short_name} long_name={long_name} />
      <TbChevronRight size={'20px'} opacity={0.25} />
    </Container>
  );
}
