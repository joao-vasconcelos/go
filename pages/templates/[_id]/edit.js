import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Textarea, Button, ActionIcon, Group, Switch, Select } from '@mantine/core';
import { Validation } from '../../../schemas/Template';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import { randomId } from '@mantine/hooks';
import SaveButtons from '../../../components/SaveButtons';
import ErrorDisplay from '../../../components/ErrorDisplay';
import useSWR from 'swr';
import { TbTrash } from 'react-icons/tb';

/* * */
/* TEMPLATES > EDIT */
/* Edit template by _id. */
/* * */

const NewFieldContainer = styled('div', {
  display: 'flex',
  padding: '$md',
  backgroundColor: '$gray2',
  gap: '$md',
});

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

  const getCorrectFieldType = (sectionIndex, fieldIndex) => {
    switch (form.values?.sections[sectionIndex]?.fields[fieldIndex].type) {
      case 'text_short':
      case 'text_long':
        return <div>text_short</div>;
      case 'select':
        return (
          <div>
            {form.values?.sections[sectionIndex]?.fields[fieldIndex].options?.map((option, optionIndex) => (
              <NewFieldContainer key={optionIndex}>
                <TextInput
                  label={'Option Value'}
                  placeholder={'Option Value'}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.options.${optionIndex}.value`)}
                />
                <TextInput
                  label={'Option Label'}
                  placeholder={'Option Label'}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.options.${optionIndex}.label`)}
                />
                <ActionIcon
                  color='red'
                  onClick={() =>
                    form.removeListItem(`sections.${sectionIndex}.fields.${fieldIndex}.options`, optionIndex)
                  }
                >
                  <TbTrash />
                </ActionIcon>
              </NewFieldContainer>
            ))}
            <Button
              variant='light'
              onClick={() => {
                console.log(form.values);
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
              Add New Option
            </Button>
          </div>
        );
      case 'file_document':
        return <div>file_document</div>;
      case 'file_image':
        return <div>file_image</div>;
      default:
        break;
    }
  };

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

  return templateData && hasUpdatedFields.current ? (
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

        <Pannel title={'Detalhes do Modelo'}>
          <Grid>
            <TextInput label={'Título'} placeholder={'Título do Modelo'} {...form.getInputProps('title')} />
          </Grid>
          <Grid>
            <Textarea
              label={'Descrição'}
              placeholder={'Mais sobre a finalidade deste modelo.'}
              {...form.getInputProps('description')}
            />
          </Grid>
        </Pannel>

        {form.values.sections?.map((section, sectionIndex) => (
          <Pannel
            key={sectionIndex}
            editMode={true}
            id={
              <TextInput
                label={'Section Title'}
                placeholder={'Section Titlte'}
                {...form.getInputProps(`sections.${sectionIndex}.key`)}
              />
            }
            title={
              <TextInput
                label={'Section Title'}
                placeholder={'Section Titlte'}
                {...form.getInputProps(`sections.${sectionIndex}.title`)}
              />
            }
            description={
              <TextInput
                label={'Section Description'}
                placeholder={'Section Explanation'}
                {...form.getInputProps(`sections.${sectionIndex}.description`)}
              />
            }
            deleteInput={
              <ActionIcon color='red' onClick={() => form.removeListItem('sections', sectionIndex)}>
                <TbTrash />
              </ActionIcon>
            }
          >
            {section.fields?.map((field, fieldIndex) => (
              <NewFieldContainer key={fieldIndex}>
                <TextInput
                  label={'Field ID'}
                  placeholder={'Field ID'}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.key`)}
                />
                <TextInput
                  label={'Field Label'}
                  placeholder={'Field Label'}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.label`)}
                />
                <TextInput
                  label={'Field Placeholder'}
                  placeholder={'Field Placeholder'}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.placeholder`)}
                />
                <Select
                  label='Field Type'
                  placeholder='Pick one'
                  clearable
                  data={[
                    { value: 'text_short', label: 'Text Input' },
                    { value: 'text_long', label: 'Text Area' },
                    { value: 'select', label: 'Select' },
                    { value: 'file_image', label: 'Upload Image' },
                    { value: 'file_document', label: 'Upload Document' },
                  ]}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.type`)}
                />
                {getCorrectFieldType(sectionIndex, fieldIndex)}
                <ActionIcon
                  color='red'
                  onClick={() => form.removeListItem(`sections.${sectionIndex}.fields`, fieldIndex)}
                >
                  <TbTrash />
                </ActionIcon>
              </NewFieldContainer>
            ))}
            <Button
              variant='light'
              onClick={() =>
                form.insertListItem(`sections.${sectionIndex}.fields`, {
                  key: randomId(),
                  id: '',
                  label: '',
                  placeholder: '',
                  type: '',
                })
              }
            >
              Add New Field
            </Button>
          </Pannel>
        ))}

        <Button
          onClick={() =>
            form.insertListItem('sections', {
              key: randomId(),
              title: '',
              description: '',
              fields: [],
            })
          }
        >
          Adicionar Secção
        </Button>
      </PageContainer>
    </form>
  ) : (
    <div>Loading...</div>
  );
}
