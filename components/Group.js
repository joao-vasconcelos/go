import { styled } from '@stitches/react';
import { GoX } from 'react-icons/go';
import { useContext } from 'react';

/* * */
/* GROUP */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  backgroundColor: '$gray0',
  borderRadius: '$md',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray5',
});

const Header = styled('div', {
  padding: '$sm',
  position: 'relative',
  backgroundColor: '$gray2',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray5',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '$bold',
  fontSize: '13px',
  color: '$gray11',
  textTransform: 'uppercase',
});

const InnerWrapper = styled('div', {
  padding: '$sm',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

/* */
/* LOGIC */

export default function Group({ title, children }) {
  //

  function handleClose() {
    console.log();
  }

  return (
    <Container>
      {title ? <Header>{title}</Header> : null}
      <InnerWrapper>{children}</InnerWrapper>
    </Container>
  );
}
