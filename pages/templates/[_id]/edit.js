import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import NewFieldContainer from '../../../components/NewFieldContainer';
import { Grid } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Textarea, Button, ActionIcon, Group, Switch, Select, Center, Stack } from '@mantine/core';
import { Validation } from '../../../schemas/Template';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import { randomId } from '@mantine/hooks';
import SaveButtons from '../../../components/SaveButtons';
import ErrorDisplay from '../../../components/ErrorDisplay';
import useSWR from 'swr';
import { TbTrash, TbPlus } from 'react-icons/tb';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CheckboxCard } from '../../../components/CheckboxCard';
import { Spacer } from '../../../components/LayoutUtils';
import NewSectionContainer from '../../../components/NewSectionContainer';

/* * */
/* TEMPLATES > EDIT */
/* Edit template by _id. */
/* * */

export default function TemplatesEdit() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { _id } = router.query;
  const hasUpdatedFields = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  //
  // B. Fetch data

  const { data: templateData, error: templateError, mutate: templateMutate } = useSWR(_id && `/api/templates/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Validation),
    initialValues: templateData,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && templateData) {
      form.setValues(templateData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [templateData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push(`/templates/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'templates', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      templateMutate({ ...templateData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, templateData, form.values, templateMutate]);

  //
  // E. Render components

  return templateData ? (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer title={['Modelos', form?.values?.title]} loading={!templateError && !templateData}>
        <ErrorDisplay error={templateError} />
        <ErrorDisplay
          error={hasErrorSaving}
          loading={isSaving}
          disabled={!form.isValid()}
          onTryAgain={async () => await handleSave()}
        />

        <SaveButtons
          isLoading={isSaving}
          isDirty={form.isDirty()}
          isValid={form.isValid()}
          onSave={async () => await handleSave()}
          onClose={async () => await handleClose()}
        />

        <Pannel>
          <TextInput
            label={'Título'}
            placeholder={'Título do Modelo'}
            description={'Será este o título selecionado pelos utilizadores.'}
            {...form.getInputProps('title')}
          />
          <Textarea
            label={'Descrição'}
            placeholder={'Mais sobre a finalidade deste modelo.'}
            description={'Mais sobre a finalidade deste modelo.'}
            {...form.getInputProps('description')}
          />
          <Switch
            label={form.values.isActive ? 'Modelo Ativo' : 'Modelo Inativo'}
            placeholder={'Título do Modelo'}
            description={
              'Quando terminar de editar este modelo ative-o para que apareça como opção ao inicar uma nova Auditoria.'
            }
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />
        </Pannel>

        <DragDropContext
          onDragEnd={({ destination, source }) =>
            form.reorderListItem('sections', { from: source.index, to: destination.index })
          }
        >
          <Droppable droppableId='dnd-list' direction='vertical'>
            {(sectionDragAndDropContext) => (
              <Stack {...sectionDragAndDropContext.droppableProps} ref={sectionDragAndDropContext.innerRef}>
                {form.values.sections?.map((section, sectionIndex) => (
                  <Draggable key={sectionIndex} index={sectionIndex} draggableId={sectionIndex.toString()}>
                    {(sectionDragAndDropProps) => (
                      <NewSectionContainer
                        form={form}
                        section={section}
                        sectionIndex={sectionIndex}
                        formPathForSection={`sections.${sectionIndex}`}
                        sectionDragAndDropProps={sectionDragAndDropProps}
                      >
                        <DragDropContext
                          onDragEnd={({ destination, source }) =>
                            form.reorderListItem(`sections.${sectionIndex}.fields`, {
                              from: source.index,
                              to: destination.index,
                            })
                          }
                        >
                          <Droppable droppableId='dnd-list' direction='vertical'>
                            {(fieldDragAndDropContext) => (
                              <Stack {...fieldDragAndDropContext.droppableProps} ref={fieldDragAndDropContext.innerRef}>
                                {section.fields?.map((field, fieldIndex) => (
                                  <Draggable key={fieldIndex} index={fieldIndex} draggableId={fieldIndex.toString()}>
                                    {(fieldDragAndDropProps) => (
                                      <NewFieldContainer
                                        form={form}
                                        field={field}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={fieldIndex}
                                        formPathForSection={`sections.${sectionIndex}`}
                                        formPathForField={`sections.${sectionIndex}.fields.${fieldIndex}`}
                                        fieldDragAndDropProps={fieldDragAndDropProps}
                                      />
                                    )}
                                  </Draggable>
                                ))}
                                {fieldDragAndDropContext.placeholder}
                                <Group>
                                  <Button
                                    variant='light'
                                    leftIcon={<TbPlus />}
                                    onClick={() =>
                                      form.insertListItem(`sections.${sectionIndex}.fields`, {
                                        key: randomId(),
                                        id: '',
                                        label: '',
                                        placeholder: '',
                                        type: '',
                                        isOpen: true,
                                      })
                                    }
                                  >
                                    Adicionar Novo Campo
                                  </Button>
                                </Group>
                              </Stack>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </NewSectionContainer>
                    )}
                  </Draggable>
                ))}
                {sectionDragAndDropContext.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>

        <Group>
          <Button
            onClick={() =>
              form.insertListItem('sections', {
                key: randomId(),
                title: '',
                description: '',
                isOpen: 'true',
                fields: [],
              })
            }
          >
            Adicionar Secção
          </Button>
        </Group>
      </PageContainer>
    </form>
  ) : (
    <div>Loading...</div>
  );
}
