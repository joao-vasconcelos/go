import { useRouter } from 'next/router';
import PageContainer from '../../../../components/PageContainer';
import Pannel from '../../../../components/Pannel';
import { Grid } from '../../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Button, ActionIcon, Group, Switch } from '@mantine/core';
import { Validation } from '../../../../schemas/audits/templates';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../../services/API';
import { randomId } from '@mantine/hooks';
import SaveButtons from '../../../../components/SaveButtons';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import useSWR from 'swr';
import { TbTrash } from 'react-icons/tb';

/* * */
/* AUDITS > TEMPLATES > EDIT */
/* Edit audit template by _id. */
/* * */

export default function AuditsEdit() {
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

  const {
    data: auditTemplateData,
    error: auditTemplateError,
    mutate: auditTemplateMutate,
  } = useSWR(_id && `/api/audits/templates/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Validation),
    initialValues: auditTemplateData,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && auditTemplateData) {
      form.setValues(auditTemplateData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [auditTemplateData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push(`/audits/templates/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'audits/templates', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      auditTemplateMutate({ ...auditTemplateData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, auditTemplateData, form.values, auditTemplateMutate]);

  //
  // E. Render components

  return auditTemplateData ? (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer
        title={['Audits', 'Templates', form?.values?.unique_code]}
        loading={!auditTemplateError && !auditTemplateData}
      >
        <ErrorDisplay error={auditTemplateError} />
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

        <Pannel title={'Template Details'}>
          <Grid>
            <TextInput label={'Title'} placeholder={'Alberta'} {...form.getInputProps('title')} />
          </Grid>
        </Pannel>

        {form.values.sections?.map((section, sectionIndex) => (
          <Pannel
            key={section.key}
            editMode={true}
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
              <Group key={field.key}>
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
                <TextInput
                  label={'Field Type'}
                  placeholder={'Field Type'}
                  {...form.getInputProps(`sections.${sectionIndex}.fields.${fieldIndex}.type`)}
                />
                <ActionIcon
                  color='red'
                  onClick={() => form.removeListItem(`sections.${sectionIndex}.fields`, fieldIndex)}
                >
                  <TbTrash />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant='light'
              onClick={() =>
                form.insertListItem(`sections.${sectionIndex}.fields`, {
                  key: randomId(),
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
          Add New Section
        </Button>
      </PageContainer>
    </form>
  ) : (
    <div>Loading...</div>
  );
}
