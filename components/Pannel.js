import { styled } from '@stitches/react';
import { useState } from 'react';
import { Grid } from './Grid';
import { TbChevronDown, TbChevronLeft } from 'react-icons/tb';
import { Group } from '@mantine/core';

/* * */
/* PANNEL */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  backgroundColor: '$gray0',
  borderRadius: '$md',
  borderWidth: '$sm',
  borderStyle: 'solid',
  borderColor: '$gray7',
});

const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$md',
  padding: '$md',
  variants: {
    isOpen: {
      true: {
        borderBottomWidth: '$sm',
        borderBottomStyle: 'solid',
        borderBottomColor: '$gray7',
      },
    },
    canOpen: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$gray3',
        },
      },
    },
  },
  defaultVariants: {
    canOpen: true,
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

export default function Pannel({ title, description, children, editMode = false, deleteInput }) {
  //
  const [isOpen, setIsOpen] = useState(title ? true : true);

  if (editMode) {
    return (
      <Container>
        <Header isOpen={true} canOpen={false}>
          <InnerWrapper css={{ padding: 0 }}>
            {title}
            {description}
          </InnerWrapper>
          {deleteInput}
        </Header>
        {isOpen && <InnerWrapper>{children}</InnerWrapper>}
      </Container>
    );
  } else {
    return (
      <Container>
        {title && (
          <Header isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
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
}
