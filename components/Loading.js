import { styled } from '@stitches/react';
import Animation from './Animation';

/* * */
/* LOADING */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

export default function Loading() {
  //

  return (
    <Container>
      <Animation name={'loading-dots'} />
    </Container>
  );
}
