import { styled } from '@stitches/react';
import { useState } from 'react';
import { TbChevronDown, TbChevronLeft } from 'react-icons/tb';

/* * */
/* GROUP */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  backgroundColor: '$gray0',
  borderRadius: '$md',
  borderWidth: '$sm',
  borderStyle: 'solid',
  borderColor: '$gray5',
  boxShadow: '$sm',
});

const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: '$sm',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray7',
  padding: '$md',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray3',
  },
});

const Title = styled('p', {
  fontSize: '$lg',
  fontWeight: '$bold',
  color: '$gray12',
});

const Description = styled('p', {
  fontSize: '$md',
  fontWeight: '$regular',
  color: '$gray10',
});

const InnerWrapper = styled('div', {
  padding: '$md',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

/* */
/* LOGIC */

export default function Group({ title, description, children }) {
  //
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      {title && (
        <Header onClick={() => setIsOpen(!isOpen)}>
          <span>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </span>
          {isOpen ? <TbChevronDown /> : <TbChevronLeft />}
        </Header>
      )}
      {isOpen && <InnerWrapper>{children}</InnerWrapper>}
    </Container>
  );
}
