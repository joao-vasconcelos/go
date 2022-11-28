import { styled } from '@stitches/react';
import NavigationButton from './NavigationButton';
import Image from 'next/image';

import { IoStorefront, IoMap, IoRocket, IoRibbon } from 'react-icons/io5';

/* * */
/* NAVIGATION */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  height: '100%',
  width: '100%',
});

const Sidebar = styled('div', {
  width: '275px',
  minWidth: '275px',
  maxWidth: '275px',
  backgroundColor: '$gray0',
  padding: '$lg',
  boxShadow: '$md',
  zIndex: 999,
  overflowY: 'scroll',
});

const NavContainer = styled('div', {
  display: 'grid',
  gap: '$md',
  marginTop: '$lg',
});

const AppContainer = styled('div', {
  width: '100%',
  padding: '50px',
  backgroundColor: '$gray1',
  overflowY: 'scroll',
});

export default function Navigation({ children }) {
  return (
    <Container>
      <Sidebar>
        <div style={{ width: '100%', height: '100px', position: 'relative' }}>
          <Image src={'/carris-metropolitana.svg'} alt={'Carris Metropolitana'} layout='fill' objectFit='contain' />
        </div>
        <NavContainer>
          <NavigationButton icon={<IoStorefront />} label={'Home'} destination={'/'} />
          <NavigationButton icon={<IoMap />} label={'Stops'} destination={'/stops'} />
          <NavigationButton icon={<IoRocket />} label={'GTFS Publisher'} destination={'/gtfs'} />
          <NavigationButton icon={<IoRibbon />} label={'Audits'} destination={'/audits'} />
        </NavContainer>
      </Sidebar>
      <AppContainer>{children}</AppContainer>
    </Container>
  );
}
