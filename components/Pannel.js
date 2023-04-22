import { styled } from '@stitches/react';
import { useState } from 'react';
import { TbChevronDown, TbChevronLeft, TbChevronRight, TbTrash } from 'react-icons/tb';
import { Divider, Group, ActionIcon, Stack, Text, Button } from '@mantine/core';
import { Spacer } from './LayoutUtils';

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
  overflow: 'hidden',
});

const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$md',
  padding: '$md',
  variants: {
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

export default function Pannel({ title, description, onDelete, children }) {
  //
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Container>
      {title && (
        <Header canOpen={true} onClick={() => setIsOpen(!isOpen)}>
          <span>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </span>
          <Group>
            {onDelete && (
              <Button variant='default' leftIcon={<TbTrash />} onClick={onDelete}>
                Eliminar Secção
              </Button>
            )}
            {isOpen ? <TbChevronDown /> : <TbChevronLeft />}
          </Group>
        </Header>
      )}
      {isOpen && (
        <>
          {title && <Divider />}
          <InnerWrapper>{children}</InnerWrapper>
        </>
      )}
    </Container>
  );
}
