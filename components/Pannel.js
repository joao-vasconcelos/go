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
  borderRadius: '$sm',
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

export default function Pannel({ title, description, children, editMode = false, id, toolbar }) {
  //
  const [isOpen, setIsOpen] = useState(title ? true : true);

  if (editMode) {
    return (
      <Container>
        <InnerWrapper>
          {isOpen ? (
            <ActionIcon variant='default' onClick={() => form.setFieldValue(`${formPathForField}.isOpen`, false)}>
              <TbChevronDown />
            </ActionIcon>
          ) : (
            <ActionIcon variant='default' onClick={() => form.setFieldValue(`${formPathForField}.isOpen`, true)}>
              <TbChevronRight />
            </ActionIcon>
          )}
          <Stack spacing={0}>
            {title ? (
              <Text>{title}</Text>
            ) : (
              <Text fs='italic' c='dimmed'>
                Campo sem título
              </Text>
            )}
            <Text fz='xs' c='dimmed'>
              {title}
            </Text>
          </Stack>
          <Spacer width={'full'} />
          <Button
            variant='default'
            leftIcon={<TbTrash />}
            onClick={() => form.removeListItem(`${formPathForSection}.fields`, fieldIndex)}
          >
            Eliminar Campo
          </Button>
        </InnerWrapper>
        {isOpen && (
          <>
            <Divider />
            <InnerWrapper>
              {id}
              {title}
              {description}
            </InnerWrapper>
            <InnerWrapper>{toolbar}</InnerWrapper>
            <Divider />
            <InnerWrapper>{children}</InnerWrapper>
          </>
        )}
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
