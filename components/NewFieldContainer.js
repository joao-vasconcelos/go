import { styled } from '@stitches/react';
import { TextInput, Button, Select, Divider, Group, ActionIcon, Text, Stack, Switch } from '@mantine/core';
import { TbTrash, TbPlaylistAdd, TbChevronDown, TbChevronRight } from 'react-icons/tb';
import { Spacer } from './LayoutUtils';
import { randomId } from '@mantine/hooks';

/* * */
/* NEW FIELD */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray0',
  border: '1px solid $gray7',
  borderRadius: '$md',
  overflow: 'hidden',
});

const InnerWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
});

const FieldHeader = styled(InnerWrapper, {
  padding: '$sm $md',
  backgroundColor: '$gray1',
});

const FieldTitle = styled('p', {
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

const FieldId = styled('p', {
  color: '$gray12',
  opacity: 0.6,
  fontFamily: 'monospace',
  fontSize: '13px',
  lineHeight: 1.4,
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

/* */
/* LOGIC */

export default function NewFieldContainer({
  form,
  field,
  section,
  sectionIndex,
  fieldIndex,
  formPathForSection,
  formPathForField,
  fieldDragAndDropProps,
}) {
  //

  const getSpecificFieldTypeOptions = () => {
    switch (field.type) {
      default:
        return <></>;
      case 'select':
        return (
          <>
            <Divider />
            <InnerWrapper>
              <Stack>
                <Text size={'sm'}>Definir Opções:</Text>
                {field.options?.map((_, optionIndex) => (
                  <Group key={optionIndex}>
                    <TextInput
                      size='xs'
                      placeholder={'Título da Opção'}
                      {...form.getInputProps(`${formPathForField}.options.${optionIndex}.label`)}
                    />
                    <TextInput
                      size='xs'
                      placeholder={'ID da Opção'}
                      {...form.getInputProps(`${formPathForField}.options.${optionIndex}.value`)}
                    />
                    <ActionIcon
                      color='red'
                      onClick={() => form.removeListItem(`${formPathForField}.options`, optionIndex)}
                    >
                      <TbTrash />
                    </ActionIcon>
                  </Group>
                ))}
                <Group>
                  <Button
                    size='xs'
                    variant='default'
                    leftIcon={<TbPlaylistAdd size={18} />}
                    onClick={() => {
                      if (!form.values.sections[sectionIndex].fields[fieldIndex].options) {
                        form.values.sections[sectionIndex].fields[fieldIndex].options = [];
                      }
                      form.insertListItem(`sections.${sectionIndex}.fields.${fieldIndex}.options`, {
                        key: randomId(),
                        value: '',
                        label: '',
                      });
                    }}
                  >
                    Adicionar Opção
                  </Button>
                </Group>
              </Stack>
            </InnerWrapper>
          </>
        );
    }
  };

  return (
    <Container ref={fieldDragAndDropProps.innerRef} {...fieldDragAndDropProps.draggableProps}>
      <FieldHeader {...fieldDragAndDropProps.dragHandleProps}>
        <Group>
          {field.isOpen ? (
            <ActionIcon variant='default' onClick={() => form.setFieldValue(`${formPathForField}.isOpen`, false)}>
              <TbChevronDown />
            </ActionIcon>
          ) : (
            <ActionIcon variant='default' onClick={() => form.setFieldValue(`${formPathForField}.isOpen`, true)}>
              <TbChevronRight />
            </ActionIcon>
          )}
          <Stack spacing={0}>
            {field.label ? <FieldTitle>{field.label}</FieldTitle> : <FieldTitle untitled>Secção sem título</FieldTitle>}
            {field.key ? <FieldId>{`${section.key}.${field.key}`}</FieldId> : <FieldId untitled>Secção sem ID</FieldId>}
          </Stack>
          <Spacer width={'full'} />
          <Button
            variant='default'
            leftIcon={<TbTrash />}
            onClick={() => form.removeListItem(`${formPathForSection}.fields`, fieldIndex)}
          >
            Eliminar Campo
          </Button>
        </Group>
      </FieldHeader>

      {field.isOpen && (
        <>
          <Divider />
          <InnerWrapper>
            <Group grow>
              <Select
                label={'Tipo de Campo'}
                placeholder={'Selecione um tipo de campo'}
                description={'Escolha o tipo de conteúdo que este campo deve receber.'}
                clearable
                data={[
                  { value: 'text_short', label: 'Texto Curto' },
                  { value: 'text_long', label: 'Texto Longo' },
                  { value: 'select', label: 'Caixa de Opções' },
                  { value: 'truefalse', label: 'Sim / Não' },
                  { value: 'file_image', label: 'Enviar Imagem' },
                  { value: 'file_document', label: 'Enviar Documento' },
                ]}
                {...form.getInputProps(`${formPathForField}.type`)}
              />
              <TextInput
                label={'Título do Campo'}
                placeholder={'Número de Chapa'}
                description={'Introduza o título do campo visível aos utilizadores.'}
                {...form.getInputProps(`${formPathForField}.label`)}
              />
              <TextInput
                label={'ID do Campo'}
                placeholder={'nr_chapa'}
                description={'Introduza o ID que irá guardar o valor na base de dados.'}
                {...form.getInputProps(`${formPathForField}.key`)}
              />
            </Group>
          </InnerWrapper>
          <InnerWrapper>
            <Group grow>
              <TextInput
                label={'Exemplo de Preenchimento'}
                placeholder={'Ex: 28281'}
                description={'Introduza um exemplo de preenchimento para ajudar ao preenchimento.'}
                {...form.getInputProps(`${formPathForField}.placeholder`)}
              />
              <TextInput
                label={'Descrição do Campo'}
                placeholder={'Introduza o número de chapa visível junto à...'}
                description={'Introduza um exemplo de preenchimento para ajudar ao preenchimento.'}
                {...form.getInputProps(`${formPathForField}.description`)}
              />
              <Switch
                label={'Permitir Cópias'}
                description={
                  'Ative esta opção se pretende que o auditor crie várias cópias deste campo com informações diferentes.'
                }
                {...form.getInputProps(`${formPathForField}.isRepeater`)}
              />
            </Group>
          </InnerWrapper>
          {getSpecificFieldTypeOptions(form, sectionIndex, fieldIndex)}
        </>
      )}
    </Container>
  );
}
