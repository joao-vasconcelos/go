import { useRouter } from 'next/router';
import PageContainer from '../../../../components/PageContainer';
import Pannel from '../../../../components/Pannel';
import { Grid, Title } from '../../../../components/LayoutUtils';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Select, Group, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { DocumentValidation } from '../../../../schemas/audits/documents';
import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import API from '../../../../services/API';
import SaveButtons from '../../../../components/SaveButtons';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import useSWR from 'swr';

/* * */
/* AUDITS > EDIT */
/* Edit audit by _id. */
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

  const { data: auditData, error: auditError, mutate: auditMutate } = useSWR(_id && `/api/audits/documents/${_id}`);
  const { data: auditTemplateData, error: auditTemplateError } = useSWR(
    auditData && `/api/audits/templates/${auditData.template_id}`
  );

  console.log(auditData);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(DocumentValidation),
    initialValues: auditData,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && auditData) {
      form.setValues(auditData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [auditData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push(`/audits/documents/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'audits/documents', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      auditMutate({ ...auditData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, auditData, form.values, auditMutate]);

  //
  // E. Render components

  return (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer title={['Audits', form?.values?.unique_code]} loading={!auditError && !auditData}>
        <ErrorDisplay error={auditError} />
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

        <Pannel title={'General Details'}>
          <Grid>
            {/* <Select
              label='Field Type'
              placeholder='Pick one'
              clearable
              data={auditTemplatesData || []}
              {...form.getInputProps('template_id')}
            /> */}
          </Grid>
        </Pannel>

        {auditTemplateData &&
          auditTemplateData.sections.map((section) => (
            <Pannel key={section.key} title={section.title} description={section.description}>
              {section.fields.map((field) => {
                switch (field.type) {
                  case 'text_short':
                    return (
                      <div key={field.key}>
                        <TextInput
                          label={field.label}
                          placeholder={field.placeholder}
                          {...form.getInputProps(`properties.${field.key}`)}
                        />
                      </div>
                    );
                  default:
                    return <div key={field.key}>{field.type}</div>;
                    break;
                }
              })}
            </Pannel>
          ))}
      </PageContainer>
    </form>
  );
}
