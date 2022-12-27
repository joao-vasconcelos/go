import { styled } from '@stitches/react';
import { useState } from 'react';
import { TbChevronDown, TbChevronLeft, TbChevronRight, TbTrash } from 'react-icons/tb';
import { Divider, Group, ActionIcon, Stack, Text, Button, TextInput, Textarea } from '@mantine/core';
import { Spacer } from './LayoutUtils';

/* * */
/* NEW SECTION CONTAINER */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray0',
  border: '1px solid $primary7',
  borderRadius: '$md',
  overflow: 'hidden',
});

const InnerWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
});

const SectionHeader = styled(InnerWrapper, {
  padding: '$sm $md',
  backgroundColor: '$primary5',
});

const SectionTitle = styled('p', {
  color: '$gray12',
  opacity: 1,
  fontSize: '18px',
  fontWeight: '$bold',
  lineHeight: 1.3,
  variants: {
    untitled: {
      true: {
        opacity: 0.3,
        fontStyle: 'italic',
        fontWeight: '$regular',
      },
    },
  },
});

const SectionId = styled('p', {
  color: '$gray12',
  opacity: 0.5,
  fontFamily: 'monospace',
  fontSize: '13px',
  lineHeight: 1.4,
  variants: {
    untitled: {
      true: {
        opacity: 1,
        fontStyle: 'italic',
        fontWeight: '$bold',
      },
    },
  },
});

/* */
/* LOGIC */

export default function NewSectionContainer({
  form,
  section,
  sectionIndex,
  formPathForSection,
  sectionDragAndDropProps,
  children,
}) {
  //

  return (
    <Container ref={sectionDragAndDropProps.innerRef} {...sectionDragAndDropProps.draggableProps}>
      <SectionHeader {...sectionDragAndDropProps.dragHandleProps}>
        <Group>
          {section.isOpen ? (
            <ActionIcon variant='default' onClick={() => form.setFieldValue(`${formPathForSection}.isOpen`, false)}>
              <TbChevronDown />
            </ActionIcon>
          ) : (
            <ActionIcon variant='default' onClick={() => form.setFieldValue(`${formPathForSection}.isOpen`, true)}>
              <TbChevronRight />
            </ActionIcon>
          )}
          <Stack spacing={0}>
            {section.title ? (
              <SectionTitle>{section.title}</SectionTitle>
            ) : (
              <SectionTitle untitled>Secção sem título</SectionTitle>
            )}
            {section.key ? <SectionId>{section.key}</SectionId> : <SectionId untitled>Secção sem ID</SectionId>}
          </Stack>
          <Spacer width={'full'} />
          <Button
            variant='default'
            leftIcon={<TbTrash />}
            onClick={() => form.removeListItem('sections', sectionIndex)}
          >
            Eliminar Secção
          </Button>
        </Group>
      </SectionHeader>

      {section.isOpen && (
        <>
          <Divider />
          <InnerWrapper>
            <Stack>
              <TextInput
                label={'Título da Secção'}
                placeholder={'Detalhes do Veículo'}
                description={'Introduza o título da secção que será visível aos utilizadores.'}
                {...form.getInputProps(`${formPathForSection}.title`)}
              />
              <TextInput
                label={'ID da Secção'}
                placeholder={'detalhes_veiculo'}
                description={
                  'Neste campo deve colocar o ID da secção. Coloque em minúsculas, sem acentos e sem espaços. Pode separar várias palavras por _ (underscores).  É sobre este ID que a informação ficará guardada na base de dados.'
                }
                {...form.getInputProps(`${formPathForSection}.key`)}
              />
              <Textarea
                label={'Descrição'}
                placeholder={'Nesta secção deve colocar os detalhes...'}
                description={'Opcionalmente introduza uma descrição que explicita o conteúdo desta secção.'}
                {...form.getInputProps(`${formPathForSection}.description`)}
              />
            </Stack>
          </InnerWrapper>
          <Divider />
          <InnerWrapper>{children}</InnerWrapper>
        </>
      )}
    </Container>
  );
}
