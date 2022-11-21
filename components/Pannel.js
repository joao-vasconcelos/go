import { styled } from '@stitches/react';
import { GoX } from 'react-icons/go';
import { useContext } from 'react';
import { Appstate } from '../context/Appstate';

/* * */
/* PANNEL */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  backgroundColor: '$gray1',
  borderRadius: '$md',
  overflow: 'hidden',
  boxShadow: '$lg',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray7',
  maxHeight: '100vh',
});

const Header = styled('div', {
  height: '50px',
  position: 'relative',
  backgroundColor: '$gray4',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray7',
});

const CloseIcon = styled('div', {
  position: 'absolute',
  float: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  aspectRatio: '9/8',
  borderRightWidth: '$md',
  borderRightStyle: 'solid',
  borderRightColor: '$gray7',
  fontSize: '30px',
  color: '$gray9',
  transition: '$default',
  cursor: 'pointer',
  '&:active': {
    color: '$gray1',
    backgroundColor: '$gray9',
  },
});

const PannelTitle = styled('p', {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$lg',
  fontWeight: '$bold',
  padding: '0 70px',
  color: '$gray12',
  textTransform: 'uppercase',
});

const InnerWrapper = styled('div', {
  padding: '$md',
  width: '100%',
  height: '100%',
});

/* */
/* LOGIC */

export default function Pannel({ title, children }) {
  //

  const appstate = useContext(Appstate);

  function handleClose() {
    appstate.setOverlay();
  }

  return (
    <Container>
      {title ? (
        <Header>
          <CloseIcon onClick={handleClose}>
            <GoX />
          </CloseIcon>
          <PannelTitle>{title}</PannelTitle>
        </Header>
      ) : null}
      <InnerWrapper>{children}</InnerWrapper>
    </Container>
  );
}
