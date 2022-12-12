import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../../schemas/Audit';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import SaveButtons from '../../../components/SaveButtons';
import ErrorDisplay from '../../../components/ErrorDisplay';
import useSWR from 'swr';

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

  const { data: auditData, error: auditError, mutate: auditMutate } = useSWR(_id && `/api/audits/templates/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Schema),
    initialValues: {
      unique_code: '',
      first_name: '',
    },
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
    router.push(`/audits/templates/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'audits/templates', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
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
      <PageContainer title={['Audits', 'Templates', form?.values?.unique_code]} loading={!auditError && !auditData}>
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

        <Pannel title={'Customer Details'}>
          <Grid>
            <TextInput label={'First Name'} placeholder={'Alberta'} {...form.getInputProps('first_name')} />
            <TextInput label={'Last Name'} placeholder={'Soares'} {...form.getInputProps('last_name')} />
            <DatePicker label={'Birthday'} placeholder={'Pick a date'} {...form.getInputProps('birthday')} />
            <TextInput label={'Reference'} placeholder={'PT'} {...form.getInputProps('reference')} />
          </Grid>
        </Pannel>
      </PageContainer>
    </form>
  );
}
